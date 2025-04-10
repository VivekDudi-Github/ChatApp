import toast from "react-hot-toast";
import { useEffect , useState } from "react";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({isError , error , fallback ,toastText}) => {
      
      if(isError){
        
        if(fallback) {
          toast.error(toastText)           
          fallback() ; 
        }
        else {
          toast.error(error?.data?.error || 
          'Something went wrong'
        )}
      }
    })
  }, [errors])

}

const UseAsyncMutation = (mutationHook) => {
  const [isLoading , setIsLoading] = useState(false) ;
  const [data , setData] = useState(null) ;

  const [mutate] = mutationHook() ;

  const executeMutation = async (toastMessage , ...args) => {
    setIsLoading(true) ;
    const toastId = toast.loading(toastMessage || "Upadting data.." )            
    
    
    try {
      const res  = await mutate(...args)
    if(res.data){
      
        toast.success( 'Operation Successfull', {id : toastId})
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
    
    Object.entries(handlers).forEach(([event , handler] ) => {
      socket.on(event , handler)
    })

    return () => {
      Object.entries(handlers).forEach(([event , handler] ) => {
        socket.off(event , handler)
        
      })
    }

  } , [socket , handlers])
}

export {useErrors , UseAsyncMutation , UseSocket}