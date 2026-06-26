export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString()
    })
  };
};