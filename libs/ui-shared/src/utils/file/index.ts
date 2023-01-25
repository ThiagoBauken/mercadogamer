import { endpoints, post } from '@utils';
import { AxiosResponse } from 'axios';
import captureVideoFrame from 'capture-video-frame';

export const postFile = async (file: File): Promise<AxiosResponse> => {
  const url = `${endpoints.fileUrl}/upload`;

  const fd = new FormData();
  if (file.type.startsWith('video')) {
    // const video = document.createElement('video');
    const video = document.getElementById('temp-video') as HTMLVideoElement;
    video.setAttribute('id', 'temp-video');
    video.setAttribute('preload', 'metadata');
    // video.src = file;
    const source = document.createElement('source');
    video.innerHTML = '';

    source.setAttribute('src', URL.createObjectURL(file));
    source.setAttribute('type', file.type);
    video.appendChild(source);
    return video.play().then(() => {
      const frame = captureVideoFrame('temp-video', 'png');
      fd.append('file', frame.blob, `${Date.now()}.png`);
      // video.remove();
      return post(url, fd);
    });
  } else {
    fd.append('file', file);
    return post(url, fd);
  }
};
