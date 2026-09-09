import { useEffect, useState } from 'react';

const RecordApp = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);

  // --- APP DATA STATE ---
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('labRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });
  
  // Added 'amount' and 'referredBy' to the initial state
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', referredBy: '', test: '', amount: '', payment: 'Cash'
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  // --- EFFECTS ---
  // Save records to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('labRecords', JSON.stringify(records));
    }
  }, [records, isAuthenticated]);

  // --- AUTHENTICATION HANDLERS ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setLoginError(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'nitin123') {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    setLoginData({ username: '', password: '' });
  };

  // --- APP DATA HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRecord = { 
      id: Date.now(), 
      ...formData,
      // Default to "Self" if referredBy is left empty
      referredBy: formData.referredBy.trim() === '' ? 'Self' : formData.referredBy 
    };
    
    setRecords([newRecord, ...records]);
    
    // Reset form
    setFormData({ name: '', age: '', gender: '', referredBy: '', test: '', amount: '', payment: 'Cash' });
  };

  const deleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  // Updated search to include amount and referred by
  const filteredRecords = records.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.referredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.amount.toString().includes(searchTerm)
  );

  // ==========================================
  // RENDER: LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow-sm text-teal-600 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Please log in to access records</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="text" name="username" value={loginData.username} onChange={handleLoginChange} required placeholder="Enter 'admin'"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" name="password" value={loginData.password} onChange={handleLoginChange} required placeholder="Enter 'password'"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>
            
            {loginError && (
              <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">Invalid username or password</p>
            )}

            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors mt-4 shadow-md">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN DASHBOARD
  // ==========================================
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-350 mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shadow-sm text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Lab Records</h1>
              <p className="text-sm text-slate-500">Manage patient tests, referrals, and payments</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 hover:text-red-500 transition-colors shadow-sm text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Form */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                New Entry
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input 
                      type="number" name="age" value={formData.age} onChange={handleChange} required min="1" max="120" placeholder="e.g. 35" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select 
                      name="gender" value={formData.gender} onChange={handleChange} required 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-white"
                    >
                      <option value="" disabled>Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Referred By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Referred By <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input 
                    type="text" name="referredBy" value={formData.referredBy} onChange={handleChange} placeholder="e.g. Dr. Smith" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>

                {/* Test & Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Test Name</label>
                    <input 
                      type="text" name="test" value={formData.test} onChange={handleChange} required placeholder="e.g. Blood Test" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                    <input 
                      type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" placeholder="e.g. 500" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer relative">
                      <input type="radio" name="payment" value="Cash" checked={formData.payment === 'Cash'} onChange={handleChange} className="peer sr-only"/>
                      <div className="text-center px-4 py-2.5 border border-slate-200 rounded-xl peer-checked:bg-teal-50 peer-checked:border-teal-500 peer-checked:text-teal-700 hover:bg-slate-50 transition-all font-medium text-sm flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Cash
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input type="radio" name="payment" value="Online" checked={formData.payment === 'Online'} onChange={handleChange} className="peer sr-only"/>
                      <div className="text-center px-4 py-2.5 border border-slate-200 rounded-xl peer-checked:bg-teal-50 peer-checked:border-teal-500 peer-checked:text-teal-700 hover:bg-slate-50 transition-all font-medium text-sm flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        Online
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors mt-2 shadow-sm">
                  Save Record
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Data Display & Search */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col overflow-hidden">
              
              {/* Search Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  Records 
                  <span className="bg-slate-100 text-slate-500 text-xs py-1 px-2 rounded-full font-bold ml-1">
                    {filteredRecords.length}
                  </span>
                </h2>
                
                <div className="relative w-full sm:w-72">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, doctor, or test..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Table or Empty State */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 flex-1 flex flex-col">
                {filteredRecords.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-slate-700 font-medium text-lg">No records found</h3>
                    <p className="text-slate-400 text-sm mt-1">Add a new record or adjust your search.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-5 py-4 font-semibold">Patient</th>
                        <th className="px-5 py-4 font-semibold">Referred By</th>
                        <th className="px-5 py-4 font-semibold">Test</th>
                        <th className="px-5 py-4 font-semibold">Payment</th>
                        <th className="px-5 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                          
                          {/* Patient Info */}
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-800">{record.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {record.age} yrs • {record.gender}
                            </div>
                          </td>
                          
                          {/* Referred By */}
                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-slate-700">
                              {record.referredBy === 'Self' ? (
                                <span className="text-slate-400 italic">Self</span>
                              ) : (
                                record.referredBy
                              )}
                            </div>
                          </td>
                          
                          {/* Test */}
                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">
                              {record.test}
                            </div>
                          </td>
                          
                          {/* Payment & Amount combined */}
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-800">₹{record.amount}</div>
                            <div className="mt-1">
                              {record.payment === 'Online' ? (
                                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full border border-blue-100 font-semibold uppercase tracking-wide">
                                  Online
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full border border-emerald-100 font-semibold uppercase tracking-wide">
                                  Cash
                                </span>
                              )}
                            </div>
                          </td>
                          
                          {/* Action */}
                          <td className="px-5 py-4 text-right">
                            <button 
                              onClick={() => deleteRecord(record.id)}
                              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
                              title="Delete Entry"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecordApp;