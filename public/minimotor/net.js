// ---------- Networking ----------
// WebSocket and WebRTC data channel transports with a common interface.
//
// WebSocket:
//   const ws = Net.connect("wss://server.example/game");
//   ws.send(new Uint8Array([1, 2, 3]));
//   ws.onMessage = (data) => { ... };
//
// WebRTC (peer-to-peer):
//   const peer = Net.createPeer();
//   peer.onSignal = (signal) => signalingServer.send(signal);
//   // When you receive a signal from the other peer:
//   peer.applySignal(receivedSignal);
//   peer.onMessage = (data) => { ... };
//   peer.send(data);
// ---------- WebSocket ----------
export function connect(config) {
    const binaryType = config.binaryType ?? "arraybuffer";
    const reconnectMs = config.reconnectMs ?? 0;
    let ws = null;
    let state = "connecting";
    let reconnectTimer = null;
    let intentionalClose = false;
    const transport = {
        onMessage: null,
        onClose: null,
        get state() {
            return state;
        },
        send(data) {
            if (state !== "connected")
                throw new Error("WebSocket not connected");
            ws.send(data);
        },
        sendJson(obj) {
            if (state !== "connected")
                throw new Error("WebSocket not connected");
            ws.send(JSON.stringify(obj));
        },
        close() {
            intentionalClose = true;
            state = "closed";
            if (reconnectTimer)
                clearTimeout(reconnectTimer);
            if (ws) {
                ws.onclose = null;
                ws.close();
            }
        },
    };
    function doConnect() {
        state = "connecting";
        ws = new WebSocket(config.url);
        ws.binaryType = binaryType;
        ws.onopen = () => {
            state = "connected";
        };
        ws.onmessage = (e) => {
            const handler = transport.onMessage;
            if (!handler)
                return;
            if (e.data instanceof ArrayBuffer) {
                handler(new Uint8Array(e.data));
            }
            else if (e.data instanceof Blob) {
                e.data.arrayBuffer().then((buf) => {
                    handler(new Uint8Array(buf));
                });
            }
        };
        ws.onclose = () => {
            state = "closed";
            if (!intentionalClose && reconnectMs > 0) {
                reconnectTimer = setTimeout(doConnect, reconnectMs);
            }
            else if (transport.onClose) {
                transport.onClose();
            }
        };
        ws.onerror = () => {
            // onclose will fire after onerror — no action needed here
        };
    }
    doConnect();
    return transport;
}
// ---------- WebRTC ----------
export function createPeer(config = {}) {
    const iceServers = config.iceServers ?? [{ urls: "stun:stun.l.google.com:19302" }];
    const trickle = config.trickle ?? true;
    let pc = null;
    let dc = null;
    let state = "connecting";
    let queuedSignals = [];
    const transport = {
        onMessage: null,
        onClose: null,
        get state() {
            return state;
        },
        send(data) {
            if (state !== "connected" || !dc)
                throw new Error("Data channel not connected");
            dc.send(data);
        },
        sendJson(obj) {
            if (state !== "connected" || !dc)
                throw new Error("Data channel not connected");
            dc.send(JSON.stringify(obj));
        },
        close() {
            if (dc)
                dc.close();
            if (pc)
                pc.close();
            state = "closed";
        },
    };
    let onSignal = null;
    function flushSignals() {
        if (!onSignal)
            return;
        for (const s of queuedSignals)
            onSignal(s);
        queuedSignals = [];
    }
    function setupPeer(pc2) {
        pc2.onicecandidate = (e) => {
            if (e.candidate) {
                const signal = { type: "candidate", candidate: e.candidate.toJSON() };
                if (onSignal)
                    onSignal(signal);
                else
                    queuedSignals.push(signal);
            }
        };
        pc2.ondatachannel = (e) => {
            setupDataChannel(e.channel);
        };
        pc2.onconnectionstatechange = () => {
            if (pc2.connectionState === "failed" || pc2.connectionState === "disconnected") {
                state = "closed";
                if (transport.onClose)
                    transport.onClose();
            }
        };
    }
    function setupDataChannel(channel) {
        dc = channel;
        dc.binaryType = "arraybuffer";
        dc.onopen = () => {
            state = "connected";
        };
        dc.onmessage = (e) => {
            const handler = transport.onMessage;
            if (handler && e.data instanceof ArrayBuffer) {
                handler(new Uint8Array(e.data));
            }
        };
        dc.onclose = () => {
            state = "closed";
            if (transport.onClose)
                transport.onClose();
        };
    }
    return {
        transport,
        connect() {
            pc = new RTCPeerConnection({ iceServers });
            const channel = pc.createDataChannel("game", {
                ordered: false, // allow out-of-order delivery for lower latency
                maxRetransmits: 0, // unreliable mode (like UDP) — game should handle lost packets
            });
            setupDataChannel(channel);
            setupPeer(pc);
            pc.createOffer().then((offer) => {
                return pc.setLocalDescription(offer);
            }).then(() => {
                if (trickle) {
                    // Wait for ICE gathering to complete (or not, if trickling)
                    // For simplicity, we wait for the full offer with candidates.
                    // A real implementation could send candidates incrementally.
                }
            }).catch(() => {
                // ICE gathering happens asynchronously; the offer will be sent
                // via onicegatheringstatechange or onicecandidate.
            });
            // Send the offer once ICE gathering is complete (or trickle candidates)
            if (!trickle) {
                // Wait for gathering to complete
                const checkGathering = () => {
                    if (pc.iceGatheringState === "complete") {
                        const signal = {
                            type: "offer",
                            sdp: JSON.stringify(pc.localDescription),
                        };
                        if (onSignal)
                            onSignal(signal);
                        else
                            queuedSignals.push(signal);
                    }
                    else {
                        setTimeout(checkGathering, 50);
                    }
                };
                checkGathering();
            }
            else {
                // With trickle, send the offer immediately and candidates will follow
                setTimeout(() => {
                    if (pc.localDescription) {
                        const signal = {
                            type: "offer",
                            sdp: JSON.stringify(pc.localDescription),
                        };
                        if (onSignal)
                            onSignal(signal);
                        else
                            queuedSignals.push(signal);
                    }
                }, 100);
            }
        },
        applySignal(signal) {
            if (!pc) {
                pc = new RTCPeerConnection({ iceServers });
                setupPeer(pc);
            }
            if (signal.type === "offer" || signal.type === "answer") {
                const desc = JSON.parse(signal.sdp);
                pc.setRemoteDescription(new RTCSessionDescription(desc)).then(() => {
                    if (signal.type === "offer") {
                        return pc.createAnswer().then((answer) => pc.setLocalDescription(answer));
                    }
                }).then(() => {
                    if (signal.type === "offer" && !trickle) {
                        const checkGathering = () => {
                            if (pc.iceGatheringState === "complete") {
                                const answerSignal = {
                                    type: "answer",
                                    sdp: JSON.stringify(pc.localDescription),
                                };
                                if (onSignal)
                                    onSignal(answerSignal);
                                else
                                    queuedSignals.push(answerSignal);
                            }
                            else {
                                setTimeout(checkGathering, 50);
                            }
                        };
                        checkGathering();
                    }
                }).catch((err) => {
                    console.warn("WebRTC signaling error:", err);
                });
            }
            else if (signal.type === "candidate" && signal.candidate) {
                pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {
                    // candidate may arrive before remote description — safe to ignore
                });
            }
            flushSignals();
        },
        set onSignal(handler) {
            onSignal = handler;
            flushSignals();
        },
        get onSignal() {
            return onSignal;
        },
    };
}
