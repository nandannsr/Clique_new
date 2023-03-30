import instance from "./axiosInstance";

const fetchVideo = async (id) => {
    try {
      const response = await instance.post('/api/adminVideoNotify',{id});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export default fetchVideo;