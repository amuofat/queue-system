import { db, ref, runTransaction } from "./firebase-config.js";

const btnTicket = document.getElementById('btn-ticket');
const ticketDisplay = document.getElementById('ticket-display');
const ticketNumberLabel = document.getElementById('ticket-number');

btnTicket.addEventListener('click', async () => {
  btnTicket.disabled = true; // prevent double-clicks
  const counterRef = ref(db, 'dailyCounter');
  const today = new Date().toISOString().split('T')[0];

  try {
    const result = await runTransaction(counterRef, (data) => {
      if (!data || data.date !== today) {
        return { date: today, count: 1 };
      }
      data.count++;
      return data;
    });

    if (result.committed) {
      const myNumber = result.snapshot.val().count;
      showTicket(myNumber);
    }
  } catch (error) {
    console.error("Transaction failed: ", error);
    alert("Error / خطأ — try again");
  } finally {
    btnTicket.disabled = false;
  }
});

function showTicket(number) {
  btnTicket.style.display = 'none';
  ticketDisplay.style.display = 'block';
  ticketNumberLabel.innerText = number;

  // Optional: Trigger print
  // window.print();

  setTimeout(() => {
    ticketDisplay.style.display = 'none';
    btnTicket.style.display = 'block';
  }, 3000);
}
