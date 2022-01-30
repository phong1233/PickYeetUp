import { createContext, useContext, useState } from 'react';

const CustomerContext = createContext(undefined);


export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState();
  const [trig, setTrig] = useState();
  const [stores, setStores] = useState();
  
    return (
      <CustomerContext.Provider value={{ setCustomer, customer, stores, setStores, trig, setTrig }}>
        {children}
      </CustomerContext.Provider>
    );
  };
  
  export const useCustomer = () => useContext(CustomerContext);