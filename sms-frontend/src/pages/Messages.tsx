type MessageStatus = 'delivered' | 'queued' | 'failed';

type MessageRow = {
  id: string;
  to: string;
  body: string;
  status: MessageStatus;
  at: string;
};

const demoRows: MessageRow[] = [
  { id: 'm1', to: '+998901112233', body: 'Tasdiqlash kodi: 482910', status: 'delivered', at: '2026-05-07 09:12' },
  { id: 'm2', to: '+998907776655', body: 'To‘lov qabul qilindi.', status: 'delivered', at: '2026-05-07 09:08' },
  { id: 'm3', to: '+998331112200', body: 'Eslatma: uchrashuv 15:00', status: 'queued', at: '2026-05-07 09:05' },
  { id: 'm4', to: '+998711009988', body: 'OTP muddati tugadi', status: 'failed', at: '2026-05-07 08:59' },
];

const statusLabel: Record<MessageStatus, string> = {
  delivered: 'Yetkazilgan',
  queued: 'Navbatda',
  failed: 'Xato',
};

export default function Messages() {
  return (
    <div className="page">
      <p className="page__lede">So‘nggi xabarlar va yetkazish holati.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Qabul qiluvchi</th>
              <th>Matn</th>
              <th>Holat</th>
              <th>Vaqt</th>
            </tr>
          </thead>
          <tbody>
            {demoRows.map((row) => (
              <tr key={row.id}>
                <td className="mono">{row.to}</td>
                <td>{row.body}</td>
                <td>
                  <span
                    className={`pill pill--${
                      row.status === 'delivered' ? 'success' : row.status === 'queued' ? 'neutral' : 'danger'
                    }`}
                  >
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="muted">{row.at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
