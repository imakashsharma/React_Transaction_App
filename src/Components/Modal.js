import React, { Component } from 'react'
import axios from "axios";
import { format } from "date-fns";

//Creating a Class Component
class Form extends Component {
    //Creating a Constructor
    constructor(props) {
        super(props)
        //Declaring Variables
        this.state = {
            Amount: '',
            Discription: '',
            TransactionType: 'Debit',
            Balance: '',
            today: new Date(),
            Date: ''
        }
    }
    handleDateChange = event => {                                   //Function to Handle Data Change
        var Date = format(this.state.today, "MM/dd/yyyy");

        this.setState({
            Date: Date
        })
    }

    handleAmountChange = event => {                      //Function to Handle Amount Change
        this.setState({
            Amount: event.target.value
        })
    }

    handleDiscriptionChange = event => {						//Function to Handle Discription Change
        this.setState({
            Discription: event.target.value
        })
    }

    handleTransactionTypeChange = event => { 				//Function to Handle Transaction Type Change
        this.setState({
            TransactionType: event.target.value
        })
    }

    handleSubmit = event => {
        if (this.state.TransactionType == 'Debit' && this.state.Balance - this.state.Amount < 0) {          //Function to Find Balance
            alert("Insufficient Balance")
        }
        else {
            axios.post('http://localhost:9000/postTransaction', this.state)                  // Axios to Post Data to MongoDB
                .then(data => {
                    console.log(data)
                })
        }
    }
    componentDidMount() {
        axios.get("http://localhost:9000/getTransaction")									 // Axios to Get Data from MongoDB
            .then(response => {
                const creditData = response.data.filter(x => x.TransactionType == "Credit");
                const debitData = response.data.filter(x => x.TransactionType == "Debit");
                let creditSum = creditData.reduce((accumulator, current) => Number(accumulator) + Number(current.Amount), 0);
                let debitSum = debitData.reduce((accumulator, current) => Number(accumulator) + Number(current.Amount), 0);

                this.setState({ Balance: creditSum - debitSum })                 //Calculating Balance

            })
            .catch(err => {
                console.log(err)
            })
    }

    ModalStyle = {
        display: 'flex',
        padding: "10px",
        marginTop: '10px',
        marginLeft: "30%",
    }

    SelectStyle = {
        display: 'flex',
        padding: "10px",
        marginTop: '10px',
        marginLeft: "30%",
        width: "200px"
    }

    ButtonStyle = {
        backgroundColor: '#0d6efd',
        border: 'none',
        borderRadius: '3px',
        color: 'white',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '14px',
        marginLeft: '40%',
        fontFamily: 'Arial'
    }
    render() {
        const { Date, Amount, Discription, TransactionType } = this.state
        return (
            <form onSubmit={this.handleSubmit}>
                {/*Creating Form to send Data */}
                <div>
                    <label style={this.ModalStyle}>
                        Choose Type of Transaction
                    </label>
                    {/*Creating DropDown Menu */}
                    <select value={TransactionType} onChange={this.handleTransactionTypeChange} style={this.SelectStyle}>
                        <option value="Debit" style={this.SelectStyle}>Debit</option>
                        <option value="Credit" style={this.SelectStyle}>Credit</option>
                    </select>
                </div>
                <div>
                    <label style={this.ModalStyle}>
                        Enter Ammount
                        <br />
                    </label>
                    <input
                        type="number"
                        value={Amount}
                        onChange={this.handleAmountChange}
                        placeholder="Amount"
                        required
                        style={this.ModalStyle}
                    />
                </div>
                <div>
                    <label style={this.ModalStyle}>
                        Enter Discription
                        <br />
                    </label>
                    <input
                        type="text"
                        value={Discription}
                        onChange={this.handleDiscriptionChange}
                        placeholder="Discription"
                        required
                        style={this.ModalStyle}
                    />
                </div>
                <br />
                <button type="submit" onClick={this.handleDateChange} style={this.ButtonStyle}>Submit</button>
            </form>
        )
    }
}
export default Form