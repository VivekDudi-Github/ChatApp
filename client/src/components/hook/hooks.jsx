import toast from "react-hot-toast";
import { useEffect , useState } from "react";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({isError , error , fallback}) => {
      if(isError){
        if(fallback) fallback() ;
        else toast.error(error?.data?.message || 
          'Something went wrong'
        )
      }
    })
  }, [errors])

}

const UseAsyncMutation = (mutationHook) => {
  const [isLoading , setIsLoading] = useState(false) ;
  const [data , setData] = useState(false) ;

  const [mutate] = mutationHook() ;

  const executeMutation = async (toastMessage , ...args) => {
    setIsLoading(true) ;
    const toastId = toast.loading(toastMessage || "Upadting data.." )            
    
    
    try {
      const res  = await mutate(...args)
    if(res.data){
        toast.success(res?.data?.data , {id : toastId})
        setData(res.data)

      }else {
        toast.error(res?.error?.data?.error || "Something went wrong" , {id : toastId})  
      }
    } catch (error) {
      toast.error("Something went wrong" , {id : toastId})
    } finally {
      setIsLoading(false)
    }
  }

  return [executeMutation , isLoading , data ]

}

const UseSocket = (socket , handlers) => {
  
  useEffect(() => {
    console.log('ran one');
    
    Object.entries(handlers).forEach(([event , handler] ) => {
      socket.on(event , handler)
      console.log('ran again');
    })

    return () => {
      Object.entries(handlers).forEach(([event , handler] ) => {
        socket.off(event , handler)
        
      })
    }

  } , [socket , handlers])
}

export {useErrors , UseAsyncMutation , UseSocket}