const knex = require("../scripts/conection");
const { format } = require("date-fns");
const registerCustomerSchema = require("../validations/registerCustomerSchema");
const customerUpdateSchema = require('../validations/customerUpdateSchema');
const { errors } = require("../scripts/error-messages");

const registerCustomer = async (req, res) => {
    const {
        name,
        email,
        cpf,
        phone,
        adress,
        cep,
        complement,
        district,
        city,
        uf,
    } = req.body;

    try {
        await registerCustomerSchema.validate(req.body);

        const registeredEmail = await knex("users").where({ email }).first();

        if (registeredEmail) {
            return res.status(400).json(errors.userExists);
        }

        const registeredCPF = await knex("users").where({ cpf }).first();

        if (registeredCPF) {
            return res.status(400).json(errors.cpfExists);
        }

        const customer = await knex("users").insert({
            name,
            email,
            cpf,
            phone,
            adress,
            cep,
            complement,
            district,
            city,
            uf,
        });

        if (!customer) {
            return res.status(400).json(errors.unregisteredCustomer);
        }

        return res.status(200).json({ mensagem: "Cliente cadastrado com sucesso" });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const currentMoment = () => new Date();

const delinquentCustomerHighligths = async (req, res) => {
    try {
        const sampleDelinquentCustomers = await knex
            .select("client.name", "due_date", "value", "client.id")
            .from("charges")
            .leftJoin("client", "client.id", "charges.client_id")
            .where("paid", "=", false)
            .where("due_date", "<", currentMoment())
            .distinctOn("client.id")
            .limit(4);

        if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
            return res.status(200).json([]);
        }

        const dueDateFormat = sampleDelinquentCustomers.map((delinquent) => {
            delinquent.due_date = format(delinquent.due_date, "yyyy-MM-dd");
            return delinquent;
        });

<<<<<<< HEAD
        return res.status(200).json({ data: dueDateFormat });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const allDelinquentCustomers = async (req, res) => {
    try {
        const sampleDelinquentCustomers = await knex.select('client.name', 'due_date', 'value', 'client.id')
            .from('charges')
            .leftJoin('client', 'client.id', 'charges.client_id')
            .where('paid', '=', false)
            .where('due_date', '<', currentMoment())
            .distinctOn('client.id');

        if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
            return res.status(400).json([]);
        }
=======
    dueDateFormat.map((highlight) => {
      {
        (highlight.value = (highlight.value / 100)
          .toFixed(2)
          .replace('.', ','));
      }
    });

    return res.status(200).json({ 'data': dueDateFormat });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const allDelinquentCustomers = async (req, res) => {
  try {
    const sampleDelinquentCustomers = await knex
      .select('clients.name', 'due_date', 'clients.id')
      .from('charges')
      .leftJoin('clients', 'clients.id', 'charges.client_id')
      .where('paid', '=', false)
      .where('due_date', '<', currentMoment())
      .distinctOn('clients.id');

    if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
      return res.status(400).json([]);
    }
>>>>>>> bde9270da143c95c383d3c08a35e541f79f4f58d

        const dueDateFormat = sampleDelinquentCustomers.map(delinquent => {
            delinquent.due_date = format(delinquent.due_date, 'yyyy-MM-dd');
            return delinquent;
        }
        )

        return res.status(200).json({ 'data': dueDateFormat });
    } catch (error) {
        return res.status(400).json({ 'message': error.message });
    }
};

const highlightsCustomersUpToDate = async (req, res) => {
<<<<<<< HEAD
    try {
        const sampleRegularizedCustomers = await knex
            .select("client.name", "due_date", "value", "client.id")
            .from("charges")
            .leftJoin("client", "client.id", "charges.client_id")
            .where("paid", "=", "true")
            .orWhere("due_date", ">", currentMoment())
            .distinctOn("client.id")
            .limit(4);

        if (
            !sampleRegularizedCustomers ||
            sampleRegularizedCustomers.length === 0
        ) {
            return res.status(200).json([]);
        }

        const dueDateFormat = sampleRegularizedCustomers.map((delinquent) => {
            delinquent.due_date = format(delinquent.due_date, "yyyy-MM-dd");
            return delinquent;
        });

        return res.status(200).json({ data: dueDateFormat });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const allCustomersUpToDate = async (req, res) => {
    try {
        const sampleRegularizedCustomers = await knex.select('client.name', 'due_date', 'value', 'client.id')
            .from('charges')
            .leftJoin('client', 'client.id', 'charges.client_id')
            .where('paid', '=', 'true')
            .orWhere('due_date', '>', currentMoment())
            .distinctOn('client.id');

        if (!sampleRegularizedCustomers || sampleRegularizedCustomers.length === 0) {
            return res.status(200).json([]);
        }

        const dueDateFormat = sampleRegularizedCustomers.map(delinquent => {
            delinquent.due_date = format(delinquent.due_date, 'yyyy-MM-dd');
            return delinquent;
        }
        )

        return res.status(200).json({ 'data': dueDateFormat });
    } catch (error) {
        return res.status(400).json({ 'message': error.message });
    }
=======
  try {
    const allCustomers = await knex('clients')
      .select('name', 'clients.id')
      .orderBy('clients.id');

    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const chargesClients = []
    for (let customer of allCustomers) {
      const chargesCustomer = await knex('charges')
        .leftJoin('clients', 'clients.id', 'charges.client_id')
        .select('*')
        .where({
          client_id: customer.id,
        });

      const checkOverdueCharge = chargesCustomer.find(
        (charge) => !charge.paid && charge.due_date < currentMoment()
      );

      if (!checkOverdueCharge) {
        for (let charge of chargesCustomer) {
          if (!charge.paid && charge.due_date > currentMoment() || charge.paid) {
            chargesClients.push(charge);
            break;
          }
        }
      }
    }
    const formatCustomersUpToDate = [];

    for (let i = 0; i < chargesClients.length; i++) {
      formatCustomersUpToDate.push({
        name: chargesClients[i].name,
        due_date: format(chargesClients[i].due_date, 'yyyy-MM-dd'),
        value: chargesClients[i].value,
        id: chargesClients[i].id
      })
    }

    formatCustomersUpToDate.map((highlight) => {
      {
        (highlight.value = (highlight.value / 100)
          .toFixed(2)
          .replace('.', ','));
      }
    });

    return res.status(200).json(formatCustomersUpToDate);
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
>>>>>>> bde9270da143c95c383d3c08a35e541f79f4f58d
}

const customers = async (req, res) => {
    const { offset } = req.query;

    const p = offset ? offset : 0;

    try {
        const allCustomers = await knex('client')
            .select('name', 'cpf', 'email', 'phone', 'id')
            .offset(p)
            .limit(10)
            .orderBy('id');

<<<<<<< HEAD
        if (!allCustomers || allCustomers.length === 0) {
            return res.status(200).json([]);
        }

        const customersData = [];
=======
    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }
>>>>>>> bde9270da143c95c383d3c08a35e541f79f4f58d

        for (let customer of allCustomers) {

            const chargesCustomer = await knex('charges').
                where({ client_id: customer.id });

            const checkOverdueCharge = chargesCustomer.find(charge => !charge.paid && charge.due_date < currentMoment());

            if (checkOverdueCharge) {
                customer.status = 'Inadimplente';
            } else {
                customer.status = 'Em dia';
            }

            customersData.push(customer);
        }

        return res.status(200).json({ 'data': customersData });
    } catch (error) {
        return res.status(400).json({ 'message': error.message });
    }
};

const customerDetail = async (req, res) => {
    const { id_customer } = req.params;

    try {
        const customer = await knex
            .select('name', 'email', 'address', 'phone', 'district', 'cpf', 'complement', 'cep', 'city', 'uf')
            .from('client')
            .where('client.id', '=', id_customer);

        if (!customer || customer.length === 0) {
            return res.status(200).json([]);
        }

        const customerCharges = await knex
            .select('charges.id', 'due_date', 'value', 'paid', 'description')
            .from('charges')
            .where('charges.client_id', '=', id_customer);


        if (!customerCharges || customerCharges.length === 0) {
            return res.status(200).json([]);
        }

        const checkBillingStatus = customerCharges.map(charge => {

            if (charge.paid === false && charge.due_date < currentMoment()) {
                charge.status = "Vencida"
            }
            if (charge.paid === false && charge.due_date > currentMoment()) {
                charge.status = "Pendente"
            }
            if (charge.paid === true) {
                charge.status = "Paga"
            }

            charge.due_date = format(charge.due_date, 'dd-MM-yyyy');
            delete charge.paid;

            return charge;
        }
        )

        const detailing = {
            data: {
                customer,
                charges: checkBillingStatus
            }
        };

        return res.status(200).json(detailing);
    } catch (error) {
        return res.status(400).json({ 'message': error.message })
    }
};

const customerUpdate = async (req, res) => {
    const { id_customer } = req.params;
    const { name, email, phone, address, complement, cep, district, city, uf } = req.body;

    if (!name && !email && !phone && !address && !complement && !cep && !district && !city && !uf) {
        return res.status(400).json({ 'error': 'é necessário informar ao menos um campo para fazer a atualização do cliente' });
    }

    try {
        await customerUpdateSchema.validate(req.body);

        const customerExists = await knex('client')
            .where('client.id', '=', id_customer)
            .first();

<<<<<<< HEAD
        if (!customerExists || customerExists.length === 0) {
            return res.status(404).json({ 'error': 'cliente não encontrado' });
        }
=======
    const checkBillingStatus = customerCharges.map((charge) => {
      (charge.value = (charge.value / 100)
        .toFixed(2)
        .replace('.', ','));

      if (charge.paid === false && charge.due_date < currentMoment()) {
        charge.status = 'Vencida';
      }
      if (charge.paid === false && charge.due_date > currentMoment()) {
        charge.status = 'Pendente';
      }
      if (charge.paid === true) {
        charge.status = 'Paga';
      }

      charge.due_date = format(charge.due_date, 'yyyy-MM-dd');
      delete charge.paid;

      return charge;
    });

    const detailing = {
      data: {
        customer,
        charges: checkBillingStatus,
      },
    };

    return res.status(200).json(detailing);
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};
>>>>>>> bde9270da143c95c383d3c08a35e541f79f4f58d

        if (email) {
            const checkEmail = await knex('client')
                .where({ email })
                .first();

            if (checkEmail) {
                return res.status(400).json({ 'error': 'email já cadastrado' });
            }
        }

        const clientEdition = await knex('client')
            .update(req.body)
            .where('client.id', '=', id_customer);

        if (!clientEdition || clientEdition.length === 0) {
            return res.status(400).json({ 'error': 'não foi possível atualizar o cliente' });
        }

        return res.status(200).json({ 'message': 'atualização do cliente concluída com sucesso' });
    } catch (error) {
        return res.status(400).json({ 'message': error.message })
    }
};

module.exports = {
    registerCustomer,
    delinquentCustomerHighligths,
    allDelinquentCustomers,
    highlightsCustomersUpToDate,
    allCustomersUpToDate,
    customers,
    customerDetail,
    customerUpdate
};

