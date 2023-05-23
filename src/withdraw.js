import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Withdraw() {
    const [user, loading, error] = useAuthState(auth);
    const [balance, setBalance] = useState(0);
    const [banks, setBanks] = useState([]);
    const [bank, setBank] = useState("");
    const [account, setAccount] = useState("");
    const [amount, setAmount] = useState("");
    const paystack_banks_url = "https://api.paystack.co/bank?currency=NGN";
    const navigate = useNavigate();
    const config = {
        headers:{
            Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
        }
      };
      

    const fetchBalance = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setBalance(data.balance);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const c = {
            headers:{
                "Authorization": `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
            },
            params: {
                account_number: account,
                bank_code: bank,
            },
          };
        const uri = "https://api.paystack.co/bank/resolve";
        axios.get(uri, c)
        .then((res) => {
            // console.log(res.data.data);
            // create transfer recipient
            const u2 = "https://api.paystack.co/transferrecipient";
            const c2 = {
                headers:{
                    "Authorization": `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    type: "nuban",
                    name: res.data.data.account_name,
                    account_number: account,
                    bank_code: bank,
                    currency: "NGN",
                },
            };

            axios.post(u2, c2)
            .then((res) => {
                console.log(res.data.data);
            })
            .catch(err=>console.log(err));
            

        })
        .catch(err=>console.log(err));
    }

    useEffect(() => {
        // if (!user) navigate("/");
        if (user) fetchBalance();
        axios.get(paystack_banks_url, config)
        .then((res) => {
            setBanks(res.data.data);
        })
        .catch(err=> console.log(err));
      }, [user, loading, error]);

    return (
        
        <Container className="mt-4">
            <h1>Withdraw Funds</h1>
            <p className="text-muted">Balance: ₦{balance/100}</p>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Bank</Form.Label>
                    <Form.Select onChange={e => setBank(e.target.value)}>
                        {banks.map((bank) => {
                            if (bank.code === bank) {
                                return (
                                    <option value={bank.code} key={bank.code} selected>{bank.name}</option>
                                )
                            }
                            else {
                                return (
                                    <option value={bank.code} key={bank.code}>{bank.name}</option>
                                )
                            }
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Account Number</Form.Label>
                    <input type="text" name="accountno" value={account} className="form-control" onChange={(e) => {
                        if (isNaN(e.target.value)) setAccount("");
                        else setAccount(e.target.value)
                    }} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <input type="text" name="accountno" value={amount} className="form-control" onChange={(e) => {
                        if (isNaN(e.target.value)) setAmount("");
                        else setAmount(e.target.value)
                    }} />
                </Form.Group>
                <Button className="mt-4" variant="primary" type="submit">
                    Withdraw
                </Button>
            </Form>
        </Container>
    );
}