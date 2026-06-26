// api/get-logs.js
export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('groq_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.status(200).json({ logs: data });
  } catch (err) {
    console.error('Get logs error:', err);
    return res.status(500).json({ error: err.message });
  }
}