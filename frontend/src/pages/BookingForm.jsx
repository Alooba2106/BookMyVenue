import { useState } from "react";

function BookingForm() {
    const[name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [guests, setGuests] = useState("");
    return(
         <section className="max-w-3xl mx-auto px-6 py-10">
            <form>
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