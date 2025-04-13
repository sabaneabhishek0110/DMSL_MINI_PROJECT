const supabase = require('../config/supabase');

const createRental = async (req, res) => {
  try {
    const { car_id, start_date, end_date } = req.body;
    
    // Get car details
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('daily_rate, available')
      .eq('id', car_id)
      .single();

    if (carError) throw carError;
    if (!car.available) {
      return res.status(400).json({ error: 'Car is not available' });
    }

    // Calculate total days and cost
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total_cost = days * car.daily_rate;

    // Create rental
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .insert([{
        user_id: req.user.id,
        car_id,
        start_date,
        end_date,
        total_cost,
        status: 'confirmed'
      }])
      .select()
      .single();

    if (rentalError) throw rentalError;

    // Update car availability
    await supabase
      .from('cars')
      .update({ available: false })
      .eq('id', car_id);

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRentals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        car:car_id (make, model, image_url, daily_rate)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRentalById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        car:car_id (*),
        user:user_id (name, email)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    // Check if user owns the rental or is admin
    if (data.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelRental = async (req, res) => {
  try {
    // First get the rental
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (rentalError) throw rentalError;
    
    // Verify ownership
    if (rental.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if cancellation is allowed
    if (rental.status !== 'confirmed') {
      return res.status(400).json({ error: 'Rental cannot be cancelled' });
    }

    // Update rental status
    const { data: updatedRental, error: updateError } = await supabase
      .from('rentals')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Make car available again
    await supabase
      .from('cars')
      .update({ available: true })
      .eq('id', rental.car_id);

    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        car:car_id (make, model),
        user:user_id (name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('rentals')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    
    // If status is completed, make car available
    if (status === 'completed') {
      await supabase
        .from('cars')
        .update({ available: true })
        .eq('id', data.car_id);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRental,
  getUserRentals,
  getRentalById,
  cancelRental,
  getAllRentals,
  updateRentalStatus
};