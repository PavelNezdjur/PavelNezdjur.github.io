import { forwardRef, useEffect } from "react"


// eslint-disable-next-line react/display-name, react/prop-types
export const Canvas = forwardRef(({draw, ...props}, canvasRef) => {
   
   useEffect (() => {
      if (!canvasRef) {
         return 
      }
      const canvas = canvasRef.current
      if(!canvas) {
         return 
      }

      const context = canvas.getContext('2d')
      if(!context) {
         return
      }
      draw(context)
      return () => context.clearRect(0, 0, window.innerWidth, 400)
   }, [draw, canvasRef])

   if (!canvasRef) {
      return null
   }
   
  return (
   <div className="canvas-container">
      <canvas ref={canvasRef} {...props}/>
   </div>
    
  )
}
);
