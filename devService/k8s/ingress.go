// import { V1Ingress } from "@kubernetes/client-node"
// import "dotenv/config"

// export const ingressManifest=async(vmId:string,url:string)=>{
//     console.log(url);
//     const ingManifest:V1Ingress={
//         apiVersion: "networking.k8s.io/v1",
//         kind: "Ingress",
//         metadata:{
//             name: vmId,
//             namespace:"vm-namespace",
//             annotations:{
//                 // WebSocket & long-lived connection friendly settings
//                 "nginx.ingress.kubernetes.io/proxy-http-version": "1.1",
//                 "nginx.ingress.kubernetes.io/proxy-read-timeout": "3600",
//                 "nginx.ingress.kubernetes.io/proxy-send-timeout": "3600",
//                 "nginx.ingress.kubernetes.io/proxy-buffering": "off",
//                 // Upstream (service) speaks HTTPS (TLS); tell ingress to use HTTPS to backend.
//                 "nginx.ingress.kubernetes.io/backend-protocol": "HTTPS",
//                 // Disable cert verification for self-signed upstream (remove in production and use proxy-ssl-secret instead).
//                 "nginx.ingress.kubernetes.io/proxy-ssl-verify": "off",
//                 // NOTE: configuration-snippet was intentionally omitted (cluster blocks it).
//             }
//         },
//         spec:{
//             ingressClassName: "nginx",
//             rules: [
//                 {
//                     host: url,
//                     http:{
//                         paths:[
//                             {
//                                 path:'/',
//                                 pathType:"Prefix",
//                                 backend:{
//                                     service:{
//                                         name:vmId,
//                                         port:{
//                                             number: 6901
//                                         }
//                                     }
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }

//     }
//     return ingManifest;
// }
