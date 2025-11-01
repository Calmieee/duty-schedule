import { useState } from 'react';
import { UserPlus, Plus } from 'lucide-react';
import { Employee, Pair } from '@/types';

interface PairsPanelProps {
	pairs: Pair[];
	employees: Employee[];
	onAddPair: (senior: string, junior: string) => void;
}

export default function PairsPanel({ pairs, employees, onAddPair }: PairsPanelProps) {
	const [showModal, setShowModal] = useState(false);
	const [senior, setSenior] = useState('');
	const [junior, setJunior] = useState('');

	const handleAdd = () => {
		if (senior && junior && senior !== junior) {
			onAddPair(senior, junior);
			setSenior('');
			setJunior('');
			setShowModal(false);
		}
	};

	return (
		<>
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<UserPlus className="w-6 h-6 text-purple-400" />
						<h3 className="text-xl font-semibold">Пары дежурных</h3>
					</div>
					<button
						onClick={() => setShowModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
					>
						<Plus className="w-4 h-4" />
						Создать пару
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{pairs.map(pair => (
						<div
							key={pair.id}
							className="p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer"
							style={{ borderColor: pair.color, backgroundColor: pair.color + '20' }}
						>
							<div className="font-semibold text-sm text-slate-300 mb-2">Дежурный:</div>
							<div className="font-bold mb-3">{pair.senior}</div>
							<div className="font-semibold text-sm text-slate-300 mb-2">Млад. дежурный:</div>
							<div className="font-bold">{pair.junior}</div>
						</div>
					))}
				</div>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-96">
						<h3 className="text-xl font-semibold mb-4">Создать пару</h3>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Дежурный</label>
							<select
								value={senior}
								onChange={(e) => setSenior(e.target.value)}
								className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
							>
								<option value="">Выберите сотрудника</option>
								{employees.map(emp => (
									<option key={emp.id} value={emp.name}>{emp.name}</option>
								))}
							</select>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Млад. дежурный</label>
							<select
								value={junior}
								onChange={(e) => setJunior(e.target.value)}
								className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
							>
								<option value="">Выберите сотрудника</option>
								{employees.map(emp => (
									<option key={emp.id} value={emp.name}>{emp.name}</option>
								))}
							</select>
						</div>

						<div className="flex gap-3">
							<button
								onClick={handleAdd}
								className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
							>
								Создать
							</button>
							<button
								onClick={() => {
									setShowModal(false);
									setSenior('');
									setJunior('');
								}}
								className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
							>
								Отмена
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}