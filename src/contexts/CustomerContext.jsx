import { createContext, useContext, useState } from 'react';

const CustomerContext = createContext(undefined);


export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState();
  const [stores, setStores] = useState();
  
    return (
      <CustomerContext.Provider value={{ setCustomer, customer, stores, setStores }}>
        {children}
      </CustomerContext.Provider>
    );
  };
  
  export const useCustomer = () => useContext(CustomerContext);