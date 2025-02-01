export const fileFormat = (url) => {
  const fileExtension = url.split('.').pop() ;

  if(fileExtension === 'mp4' || fileExtension === 'webm' || fileExtension === 'ogg')
    return 'video'

  if(fileExtension === 'mp3' || fileExtension === 'wav')
    return 'audio'

  if(fileExtension === 'jpeg' || fileExtension === 'jpg' || fileExtension === 'png' || fileExtension == 'gif')
    return 'image'

}