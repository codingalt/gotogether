const cacheData = 'gotogether_appV1';

this.addEventListener('install', (e)=>{
    e.waitUntil(
        (async() => {
            try {
               var cache_obj = await caches.open(cacheData)
                cache_obj.addAll([
                    "/static/js/bundle.js",
                    "/static/js/main.chunk.js",
                    "/static/js/0.chunk.js",
                    "/index.html",
                    "/",
                    "/"
                ])
               
            }
            catch{
                console.log("error occured while caching...")
            }
        })()

      
    )
})

// this.addEventListener('fetch', (e)=>{
//     if(!navigator.onLine){
//         e.respondWith(
//             caches.match(e.request).then((result)=>{
//                 if(result){
//                   return result
//                 }
//                 let requestUrl = e.request.clone();
//             }) 
//         )
//     }
// })