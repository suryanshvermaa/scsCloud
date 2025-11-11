import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaDocker } from "react-icons/fa";
import { PlusIcon, TrashIcon, ClipboardDocumentIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { notifier } from "../utils/notifier";
import {
  createDeployment,
  deleteDeployment,
  getDeployments,
  type Deployment,
  type DeploymentConfig,
  type EnvironmentVar,
} from "../utils/containerServiceApi";

const DEFAULTS: Required<Pick<DeploymentConfig, "cpu" | "memory" | "port" | "replicas">> = {
  cpu: 0.5,
  memory: "10Gi",
  port: 80,
  replicas: 1,
};

const ContainerServiceDashboard: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Create modal state
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [config, setConfig] = useState<DeploymentConfig>({
    dockerImage: "",
    cpu: DEFAULTS.cpu,
    memory: DEFAULTS.memory,
    port: DEFAULTS.port,
    replicas: DEFAULTS.replicas,
    environments: [],
  });

  // Delete modal state
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);

  const hasRequired = useMemo(() => config.dockerImage.trim().length > 0, [config.dockerImage]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getDeployments();
      setDeployments(data || []);
    } catch (e: any) {
      console.error(e);
      notifier.error(e?.response?.data?.message || "Failed to load deployments");
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      const data = await getDeployments();
      setDeployments(data || []);
    } catch (e: any) {
      console.error(e);
      notifier.error(e?.response?.data?.message || "Failed to refresh deployments");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    if (!hasRequired) {
      notifier.warning("Docker image is required");
      return;
    }
    try {
      setCreating(true);
      const payload: DeploymentConfig = {
        dockerImage: config.dockerImage.trim(),
        cpu: config.cpu ?? DEFAULTS.cpu,
        memory: config.memory || DEFAULTS.memory,
        port: config.port ?? DEFAULTS.port,
        replicas: config.replicas ?? DEFAULTS.replicas,
        environments: (config.environments || []).filter((e) => e.key?.trim()),
      };
      const res = await createDeployment(payload);
      notifier.success("Container deployed successfully");
      setOpenCreate(false);
      // Reset minimal fields for next use
      setConfig({
        dockerImage: "",
        cpu: DEFAULTS.cpu,
        memory: DEFAULTS.memory,
        port: DEFAULTS.port,
        replicas: DEFAULTS.replicas,
        environments: [],
      });
      await refresh();
      // Do not auto-open URL; service may take time to become ready
      if (res?.url) {
        notifier.info("Deployment created. It may take a few minutes to be reachable. Use Refresh to update status.");
      } else {
        notifier.info("Deployment created. It may take a few minutes to be reachable. Use Refresh to update status.");
      }
    } catch (e: any) {
      console.error(e);
      notifier.error(e?.response?.data?.message || "Failed to create deployment");
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteDeployment(deleteId);
      notifier.success("Deployment deleted");
      setOpenDelete(false);
      setDeleteId("");
      await refresh();
    } catch (e: any) {
      console.error(e);
      notifier.error(e?.response?.data?.message || "Failed to delete deployment");
    } finally {
      setDeleting(false);
    }
  };

  const addEnvRow = () => {
    setConfig((prev) => ({
      ...prev,
      environments: [...(prev.environments || []), { key: "", value: "" }],
    }));
  };

  const updateEnvRow = (idx: number, patch: Partial<EnvironmentVar>) => {
    setConfig((prev) => {
      const envs = [...(prev.environments || [])];
      envs[idx] = { ...envs[idx], ...patch } as EnvironmentVar;
      return { ...prev, environments: envs };
    });
  };

  const removeEnvRow = (idx: number) => {
    setConfig((prev) => {
      const envs = [...(prev.environments || [])];
      envs.splice(idx, 1);
      return { ...prev, environments: envs };
    });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notifier.success("Copied to clipboard");
    } catch {
      notifier.error("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:ring-sky-500/40">
              <FaDocker />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Container Service</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Deploy Docker containers with a single click. Similar to AWS ECS / Cloud Run.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 text-sm"
            >
              <PlusIcon className="h-4 w-4" /> New Deployment
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-slate-600 dark:text-slate-300">Loading deployments...</div>
        ) : deployments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-600 dark:text-slate-300">
            No deployments found. Create your first deployment to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deployments.map((d) => (
              <div key={d.id || d.name} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold">{d.serviceSubdomain || d.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-300 break-all">{d.dockerImage}</div>
                  </div>
                  <button
                    onClick={() => confirmDelete(d.id || d.name)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs"
                  >
                    <TrashIcon className="h-4 w-4" /> Delete
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-slate-50 dark:bg-slate-700/50 p-2">
                    <div className="text-slate-500 dark:text-slate-300">Replicas</div>
                    <div className="text-slate-800 dark:text-white font-medium">{d.replicas}</div>
                  </div>
                  <div className="rounded-md bg-slate-50 dark:bg-slate-700/50 p-2">
                    <div className="text-slate-500 dark:text-slate-300">Port</div>
                    <div className="text-slate-800 dark:text-white font-medium">{d.port}</div>
                  </div>
                  <div className="rounded-md bg-slate-50 dark:bg-slate-700/50 p-2">
                    <div className="text-slate-500 dark:text-slate-300">CPU</div>
                    <div className="text-slate-800 dark:text-white font-medium">{d.cpu}</div>
                  </div>
                  <div className="rounded-md bg-slate-50 dark:bg-slate-700/50 p-2">
                    <div className="text-slate-500 dark:text-slate-300">Memory</div>
                    <div className="text-slate-800 dark:text-white font-medium">{d.memory}</div>
                  </div>
                </div>

                {d.url && (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <a
                      href={d.url}
                      target="_blank"
                      className="truncate text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400"
                      rel="noreferrer"
                    >
                      {d.url}
                    </a>
                    <button
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => copy(d.url!)}
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" /> Copy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Deployment Modal */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">New Deployment</DialogTitle>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Provide container settings. Fields left blank will use defaults.</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Docker Image *</label>
                    <input
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="nginx:latest"
                      value={config.dockerImage}
                      onChange={(e) => setConfig((p) => ({ ...p, dockerImage: e.target.value }))}
                    />
                  </div>

                  {/* Service subdomain input removed as it is no longer supported by backend */}

                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Replicas</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                      value={config.replicas ?? DEFAULTS.replicas}
                      onChange={(e) => setConfig((p) => ({ ...p, replicas: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Port</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                      value={config.port ?? DEFAULTS.port}
                      onChange={(e) => setConfig((p) => ({ ...p, port: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">CPU (cores)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0.1}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                      value={config.cpu ?? DEFAULTS.cpu}
                      onChange={(e) => setConfig((p) => ({ ...p, cpu: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Memory (Gi)</label>
                    <input
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                      placeholder="10Gi"
                      value={String(config.memory ?? DEFAULTS.memory)}
                      onChange={(e) => setConfig((p) => ({ ...p, memory: e.target.value }))}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm text-slate-600 dark:text-slate-300">Environment Variables</label>
                      <button
                        type="button"
                        onClick={addEnvRow}
                        className="inline-flex items-center gap-1 text-xs rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <PlusIcon className="h-3 w-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(config.environments || []).length === 0 && (
                        <div className="text-xs text-slate-500">No environment variables</div>
                      )}
                      {(config.environments || []).map((env, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2">
                          <input
                            className="col-span-5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                            placeholder="KEY"
                            value={env.key}
                            onChange={(e) => updateEnvRow(idx, { key: e.target.value })}
                          />
                          <input
                            className="col-span-6 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                            placeholder="value"
                            value={env.value}
                            onChange={(e) => updateEnvRow(idx, { value: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => removeEnvRow(idx)}
                            className="col-span-1 inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setOpenCreate(false)}
                    className="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onCreate}
                    disabled={!hasRequired || creating}
                    className="inline-flex items-center gap-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {creating && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />}
                    Deploy
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">Delete Deployment</DialogTitle>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete this deployment? This action cannot be undone.</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setOpenDelete(false)}
                    className="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {deleting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />}
                    Delete
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ContainerServiceDashboard;
