const Contact = () => {
  return (
    <div className="pt-24 pb-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Hubungi Kami</h1>
      <p className="text-lg text-gray-600 mb-4">
        Ada pertanyaan atau keluhan? Jangan ragu untuk menghubungi tim support kami.
      </p>
      <ul className="space-y-2 text-gray-700">
        {/* <li>Email: hello@cemilansultan.com</li> */}
        <li>WhatsApp: +62 823-4445-4155</li>
        <li>Alamat: Jl.Drs.H.M.Yoesoef Masjid,Bukit Harapan,Kec.Soreang Kota Parepare</li>
      </ul>
    </div>
  );
};

export default Contact;
