# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Custom server config: korrekt MIME-typ for .mjs och no-cache pa
# index.html/sw.js/manifest sa nya versioner alltid plockas upp.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your static files into the nginx html directory
COPY ./public/ /usr/share/nginx/html

# Stampla service workerns cachenyckel med byggtidpunkten. Varje ny image
# far darmed en ny cacheversion och installerade PWA-klienter hamtar de nya
# filerna vid nasta besok - ingen manuell bump behovs. (Layer-cachning gor
# att stampeln bara andras nar filerna i public/ faktiskt andrats.)
RUN sed -i "s/__BUILD_STAMP__/$(date -u +%Y%m%d%H%M%S)/" /usr/share/nginx/html/sw.js

# Expose port 80
EXPOSE 80

# Lat Portainer se om nginx faktiskt svarar, inte bara att processen lever
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO /dev/null http://127.0.0.1/ || exit 1

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
