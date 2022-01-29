import { createContext, useContext, useState } from 'react';

const CustomerContext = createContext(undefined);


export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState();
  
    return (
      <CustomerContext.Provider value={{ setCustomer, customer }}>
        {children}
      </CustomerContext.Provider>
    );
  };
  
  export const useCustomer = () => useContext(CustomerContext);