import {} from "@kubernetes/client-node";

const getIngressConfig=(ingressName: string, ingressHost:string,ingressService: string,servicePort: number, namespace: string)=>{
    const ingressConfig: any = {
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
            name: ingressName,
            namespace,
            labels: {
                "app.kubernetes.io/name": ingressName,
                "app.kubernetes.io/part-of": "scs-cloud"
            }
        },
        spec: {
            rules: [
                {
                    host: ingressHost,
                    http: {
                        paths: [
                            {
                                pathType: "Prefix",
                                path: "/",
                                backend: {
                                    service: {
                                        name: ingressService,
                                        port: {
                                            number: servicePort
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
    return ingressConfig;
}

export default getIngressConfig;