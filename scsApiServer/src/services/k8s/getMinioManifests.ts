import { V1Deployment, V1PersistentVolume, V1Secret } from "@kubernetes/client-node";

const getMinioManifests = (user:string,storageInGB:number,accesskey:string,secretkey:string) => {
    const deployment:V1Deployment={
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
            name: "minio-deployment"+user,
            namespace: "minio",
            labels: {
                app: "minio"+user,
            },
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: {
                    app: "minio"+user
                },
            },
            template: {
                metadata: {
                    labels: {
                        app: "minio"+user
                    },
                },
                spec: {
                    containers: [
                        {
                            name: "minio",
                            image: "minio/minio",
                            args: ["server", "/data"],
                            ports: [
                                {
                                    containerPort: 9000,
                                },
                            ],
                            env: [
                                {
                                    name: "MINIO_ROOT_USER",
                                    valueFrom:{
                                        secretKeyRef:{
                                            name: "minio-secret"+user,
                                            key: "accesskey"
                                        }
                                    },
                                },
                                {
                                    name: "MINIO_ROOT_PASSWORD",
                                    valueFrom:{
                                        secretKeyRef:{
                                            name: "minio-secret"+user,
                                            key: "secretkey"
                                        }
                                    },
                                },
                            ],
                            volumeMounts:[
                                {
                                    name: "minio-storage",
                                    mountPath: "/data",
                                }
                            ]
                        },

                    ],
                    volumes:[
                        {
                            name: "minio-storage",
                            persistentVolumeClaim:{
                                claimName: "minio-pvc"+user
                            }
                        }
                    ]
                },
            },
        },
    };

    const persistentVolume:V1PersistentVolume={
        apiVersion: "v1",
        kind: "PersistentVolume",
        metadata: {
            name: "minio-pv"+user,
            namespace: "minio",
        },
        spec: {
            capacity: {
                storage: `${storageInGB}Gi`
                },
            volumeMode: "Filesystem",
            accessModes: ["ReadWriteOnce"],
            persistentVolumeReclaimPolicy: "Retain",
            hostPath: {
                path: `/mnt/minio/${user}`
            },
        },
    }

    const persistentVolumeClaim={
        apiVersion: "v1",
        kind: "PersistentVolumeClaim",
        metadata: {
            name: "minio-pvc"+user,
            namespace: "minio",
        },
        spec: {
            accessModes: ["ReadWriteOnce"],
            resources: {
                requests: {
                    storage: `${storageInGB}Gi`
                },
            },
        },
    }

    const secrets: V1Secret={
        apiVersion: "v1",
        kind: "Secret",
        metadata: {
            name: "minio-secret"+user,
            namespace: "minio",
        },
        type: "Opaque",
        stringData: {
            accesskey: accesskey,
            secretkey: secretkey,
        },
    }

    const service={
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            name: "minio-service"+user,
            namespace: "minio",
        },
        spec: {
            selector: {
                app: "minio"+user
            },
            ports: [
                {
                    port: 9000,
                    targetPort: 9000
                }
            ],
            type: "ClusterIP"
        },
    }

    const ingress={
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
            name: "minio-ingress"+user,
            namespace: "minio",
            labels: {
                "app.kubernetes.io/name": "minio-ingress"+user,
                "app.kubernetes.io/part-of": "minio"
            }
        },
        spec: {
            rules: [
                {
                    host: `minio-${user}.${process.env.HOSTING_DOMAIN!}`,
                    http: {
                        paths: [
                            {
                                pathType: "Prefix",
                                path: "/",
                                backend: {
                                    service: {
                                        name: "minio-service"+user,
                                        port: {
                                            number: 9000
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
    return {deployment,persistentVolume,persistentVolumeClaim,secrets,service,ingress};
};

export default getMinioManifests;