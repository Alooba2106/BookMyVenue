import { useState } from "react";

function BookingForm() {
    const[name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [guests, setGuests] = useState("");
    const [bookingConfirmed,setBookingConfirmed]=useState(false);

    function handleSubmit(event){
        event.preventDefault();
        

        if (name.trim()=== ""){
            alert("Name is Required" );
            return
        }
       
        if (email.trim() === "" || !email.includes("@")) {
             alert("Enter a valid email");
            return;
        }
        if(phone.trim().length<10){
            alert("Phone number must be 10 digits.")
            return
        }
        if (Number(guests) <= 0) {
            alert("Number of guests must be greater than 0");
            return;
        }

        if (eventDate === "") {
            alert("Event date is required");
            return;
        }      
       
        const today = new Date().toISOString().split("T")[0];

        if (eventDate < today) {
            alert("Event date cannot be in the past");
            return;
        }
        console.log("Booking successful");
        setBookingConfirmed(true);
       
    }

    if(bookingConfirmed){
             return (
                <section className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Booking Confirmed 🎉
                </h1>

                <p>Thank you for your booking request.</p>
    </section>
  );
        }
    return(
         <section className="max-w-3xl mx-auto px-6 py-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text"
                placeholder="FullName"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
            />

                <input type="text"
                 placeholder="email"
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 className="w-full border rounded-lg px-4 py-3"
                 />

                <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
            />

            <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
            />

        <input
            type="number"
            placeholder="Number of Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
        />

    <button
    type="submit"
    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
    >
        Confirm Booking
    </button>
            </form>
        
        </section>
    )


}

export default BookingForm;