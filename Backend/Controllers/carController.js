const supabase = require('../config/supabase');

const getAllCars = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableCars = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCarById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Car not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCar = async (req, res) => {
  try {
    const { make, model, year, license_plate, daily_rate, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('cars')
      .insert([{
        make,
        model,
        year,
        license_plate,
        daily_rate,
        image_url,
        available: true
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCars,
  getAvailableCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};