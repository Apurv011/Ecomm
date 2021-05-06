require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.checkout = async (req, res, next) => {
  let error;
  let status;

  try {
    const customer = await stripe.customers.create({
      email: req.body.token.email,
      source: req.body.token.id
    });

      const charge = await stripe.charges.create(
        {
          amount: req.body.itemsPrice*100,
          currency: "inr",
          customer: customer.id,
          receipt_email: req.body.token.email,
          description: "Purchased Successfully!",
          shipping: {
            name: req.body.token.card.name,
            address: {
              line1: req.body.token.card.address_line1,
              line2: req.body.token.card.address_line2,
              city: req.body.token.card.address_city,
              country: req.body.token.card.address_country,
              postal_code: req.body.token.card.address_zip
            }
          }
        }
      );
      status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
}
