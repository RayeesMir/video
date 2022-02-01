const fetch = require("isomorphic-fetch");

module.exports = ({ host = "http://localhost", port = 3000 } = {}) => {
  const baseUri = `${host}:${port}`;

  const get = async ({ path, query }) => fetch(`${baseUri}${path}?${query}`);

  const create = async (path, body) =>
    fetch(`${baseUri}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const update = async (path, id, body) =>
    fetch(`${baseUri}${path}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const remove = async (path, id) =>
    fetch(`${baseUri}${path}/${id}`, {
      method: "DELETE",
    });

  const fetchVideos = async (query) => get({ path: "/video", query });

  const listVideos = async (query) => {
    const response = await fetchVideos(query);
    return response.json();
  };

  const videoPayload = ({
    name = "video_name",
    url = "https://one.com",
    thumbnailUrl = "https://one.com",
    isPrivate = false,
  } = {}) => ({
    name,
    url,
    thumbnailUrl,
    isPrivate,
  });

  const createVideo = (video) => {
    const body = video ? video : videoPayload();
    return create("/video", body);
  };

  const createAndReturnVideo = async (video) => {
    const response = await createVideo(video);
    return response.json();
  };

  const updateVideo = (id, video) => update("/video", id, video);

  const deleteVideo = (id) => remove("/video", id);

  return {
    videoPayload,
    createVideo,
    createAndReturnVideo,
    updateVideo,
    fetchVideos,
    listVideos,
    deleteVideo,
  };
};
