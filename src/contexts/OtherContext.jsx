import { createContext, useContext, useState } from 'react';

const OtherContext = createContext(undefined);


export const OtherProvider = ({ children }) => {
    const [customer, setCustomer] = useState();
  
    return (
      <OtherContext.Provider value={{ customer, setCustomer }}>
        {children}
      </OtherContext.Provider>
    );
  };
  
  export const useOther = () => useContext(OtherContext);