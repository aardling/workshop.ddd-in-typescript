const authToken = (process.env.DDD_AUTH_TOKEN as string) || "";
const workshopId = (process.env.WORKSHOP_ID as string) || "";
const workshopServerUrl = (process.env.WORKSHOP_SERVER_URL as string) || "";

export async function get(path: string) {
  const response = await fetch(`${workshopServerUrl}${path}`, {
    method: "GET",
    headers: {
      "x-auth-token": authToken,
      "x-workshop-id": workshopId,
      "content-type": "application/json",
    },
  });
  return await response.json();
}
export async function post(path: string, body: object) {
  console.log(authToken, workshopId);
  const response = await fetch(`${workshopServerUrl}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "x-auth-token": authToken,
      "x-workshop-id": workshopId,
      "content-type": "application/json",
    },
  });
  return await response.json();
}
