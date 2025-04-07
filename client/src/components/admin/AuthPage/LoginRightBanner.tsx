export default function LoginRightBanner() {
    return (
      <div className="hidden relative bg-[#FF9838] md:flex md:w-1/2 flex-col justify-center items-center text-white p-8">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ffb06b] opacity-50 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-[#ffb06b] opacity-50 -mr-10 -mb-10"></div>
  
        <div className="z-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Hey</h2>
          <h2 className="text-3xl font-bold mb-2">Welcome</h2>
          <h2 className="text-3xl font-bold">Back</h2>
        </div>
      </div>
    )
  }  