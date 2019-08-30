# Tolk

Deployed on GitHub according to the documention on https://angular.io/guide/deployment#deploy-to-github-pages.

`ng build --prod --output-path docs --base-href /tolk/`

How to create pwa icons, see: https://github.com/pverhaert/ngx-pwa-icons

Testing pwa: build the app and rename the docs folder to 'tolk'. 
Then:  `http-server -p 8080 -c-1` and navigate to localhost:8080/tolk

NB. When using images in the assets folder, in the template use relative paths, e.g. `<img src="assets/img/info-icon.svg" alt="info-icon">`
