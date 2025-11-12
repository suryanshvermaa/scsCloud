import { V1Deployment, V1Service } from "@kubernetes/client-node"

// /* Deployment manifest for a VM in Kubernetes
// * @param image - The image to use for the VM
// * @param vmId - The ID of the VM
// * @param password - The password for the VM
// * @return - The deployment manifest for the VM
// */
// export const vmDeploymentManifest=async(image:string,vmId:string,password:string)=>{
//     const deployment:V1Deployment={
//         apiVersion: "apps/v1",
//         kind:"Deployment",
//         metadata:{
//             name:vmId,
//             labels:{
//                 app:vmId,
//             },
//             namespace:"vm-namespace",
//         },
//         spec:{
//             replicas:1,
//             selector:{
//                 matchLabels:{
//                     app:vmId,
//                 }
//             },
//             template:{
//                 metadata:{
//                     labels:{
//                         app:vmId,
//                     }
//                 },
//                 spec:{
//                     containers:[
//                         {
//                             name:"vm-container",
//                             image:image,
//                             ports:[
//                                 {
//                                     containerPort:6901,
//                                 }
//                             ],
//                             env:[
//                                 {
//                                     name:"VNC_PW",
//                                     value:password,
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             }
//         }
//     }
//     return deployment;
// }

// /* Service manifest for a VM in Kubernetes
// * @param vmId - The ID of the VM
// * @return - The service manifest for the VM
// */
// export const vmServiceManifest=async(vmId:string)=>{
//     const service:V1Service={
//         apiVersion:"v1",
//         kind:"Service",
//         metadata:{
//             name:vmId,
//             labels:{
//                 app:vmId,
//             },
//             namespace:"vm-namespace",
//         },
//         spec:{
//             selector:{
//                 app:vmId,
//             },
//             ports:[
//                 {
//                     protocol:"TCP",
//                     port:6901,
//                     targetPort:6901,
//                 }
//             ]
//         }
//     }
//     return service;
// }