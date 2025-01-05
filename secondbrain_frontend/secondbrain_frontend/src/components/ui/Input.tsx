export function Input({  placeholder, type = "text" , reference}: { 
  placeholder: string; 
  reference:any;
  type?: string; 
}) {
  return (
    <div>
      <input
      ref={reference}
        placeholder={placeholder}
        type={type} 
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        
      />
    </div>
  );
}