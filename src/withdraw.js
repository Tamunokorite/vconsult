import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Withdraw() {
  const [user, loading, error] = useAuthState(auth);
  const [balance, setBalance] = useState(0);
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const paystack_banks_url = "https://api.paystack.co/bank?currency=NGN";
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
    }
  };

  const navigate = useNavigate();

  const fetchBalance = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const docSnapshots = await getDocs(q);
      const docData = docSnapshots.docs[0].data();
      setBalance(docData.balance);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bank || !account || !amount) {
      alert("Please fill in all the required fields");
      return;
    }

    const resolveAccountUrl = "https://api.paystack.co/bank/resolve";
    const resolveAccountConfig = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
      },
      params: {
        account_number: account,
        bank_code: bank
      }
    };

    try {
      const resolveAccountResponse = await axios.get(resolveAccountUrl, resolveAccountConfig);
      const accountName = resolveAccountResponse.data.data.account_name;
      const newBalance = balance - (parseInt(amount) * 100);
      setBalance(newBalance);

    //   const createRecipientUrl = "https://api.paystack.co/transferrecipient";
    //   const createRecipientConfig = {
    //     headers: {
    //       Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`,
    //       'Content-Type': 'application/json'
    //     },
    //     data: {
    //       type: "nuban",
    //       name: accountName,
    //       account_number: account,
    //       bank_code: bank,
    //       currency: "NGN"
    //     }
    //   };

    //   const createRecipientResponse = await axios.post(createRecipientUrl, createRecipientConfig);
    //   const recipientCode = createRecipientResponse.data.data.recipient_code;
    //   const newBalance = balance - parseInt(amount);

    //   const initiateTransferUrl = "https://api.paystack.co/transfer";
    //   const initiateTransferData = {
    //     source: "balance",
    //     amount: parseInt(amount) * 100,
    //     recipient: recipientCode
    //   };
    //   const initiateTransferConfig = {
    //     headers: {
    //       Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`,
    //       'Content-Type': 'application/json'
    //     },
    //     data: initiateTransferData
    //   };

    //   await axios.post(initiateTransferUrl, initiateTransferConfig);

      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { balance: newBalance });

      alert("Withdrawal successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("An error occurred while processing the withdrawal.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }

    axios.get(paystack_banks_url, config)
      .then((res) => {
        setBanks(res.data.data);
      })
      .catch(err => console.log(err));
  }, [user]);

  return (
    <Container className="mt-4">
      <h1>Withdraw Funds</h1>
      <p className="text-muted">Balance: ₦{balance/100}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Bank</Form.Label>
          <Form.Select value={bank} onChange={e => setBank(e.target.value)}>
            <option value="">Select Bank</option>
            {banks.map(bank => (
                <option value={bank.code} key={bank.code}>
                {bank.name}
                </option>
            ))}
        </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Account Number</Form.Label>
          <input
            type="text"
            name="accountno"
            value={account}
            className="form-control"
            onChange={(e) => {
              if (isNaN(e.target.value)) setAccount("");
              else setAccount(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <input
            type="text"
            name="amount"
            value={amount}
            className="form-control"
            onChange={(e) => {
              if (isNaN(e.target.value)) setAmount("");
              else setAmount(e.target.value);
            }}
          />
        </Form.Group>
        <Button className="mt-4" variant="primary" type="submit">
          Withdraw
        </Button>
      </Form>
    </Container>
  );
}
