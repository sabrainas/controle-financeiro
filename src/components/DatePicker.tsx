interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const handlePreviousDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date();
    onDateChange(today.toISOString().split('T')[0]);
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-2xl p-10 lg:p-16 border border-slate-700">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-14">
        <div className="flex-1">
          <label htmlFor="datePicker" className="block text-sm font-bold text-slate-300 mb-5 uppercase tracking-widest">
            Selecione a data
          </label>
          <div className="relative">
            <input
              id="datePicker"
              type="date"
              value={selectedDate}
              onChange={handleDateInput}
              className="w-full px-6 py-5 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition text-lg font-semibold hover:border-slate-500"
            />
          </div>
          <p className="mt-5 text-slate-200 font-semibold text-lg lg:text-xl capitalize">
            {formatDate(selectedDate)}
          </p>
        </div>

        <div className="flex gap-5 lg:gap-6">
          <button
            onClick={handlePreviousDay}
            className="flex-1 lg:flex-none bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-5 px-8 lg:px-10 rounded-lg transition text-base lg:text-lg shadow-lg hover:shadow-xl"
          >
            ← Anterior
          </button>
          
          <button
            onClick={handleToday}
            className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 lg:px-10 rounded-lg transition text-base lg:text-lg shadow-lg hover:shadow-xl"
          >
            Hoje
          </button>
          
          <button
            onClick={handleNextDay}
            className="flex-1 lg:flex-none bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-5 px-8 lg:px-10 rounded-lg transition text-base lg:text-lg shadow-lg hover:shadow-xl"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  );
}
