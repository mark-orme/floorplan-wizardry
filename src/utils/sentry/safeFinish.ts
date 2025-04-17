
export const safeFinish = (
  tx: { finish: (status: string) => void } | null | undefined, 
  status = 'ok'
) => {
  if (tx?.finish) tx.finish(status);
};
