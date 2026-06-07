export const getGeoInfo = async () => {
  const data = await fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .catch(() => {
      return null;
    });
  return data;
};
