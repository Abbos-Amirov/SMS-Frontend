type ContactsPaginationProps = {
  total: number;
  start: number;
  end: number;
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
};

export function ContactsPagination({
  total,
  start,
  end,
  page,
  pageCount,
  onPrev,
  onNext,
}: ContactsPaginationProps) {
  return (
    <div className="contacts-pagination">
      <p className="contacts-pagination__info">
        Umumiy {total} yozuvlardan {start} dan {end} gachasi ko‘rsatilmoqda
      </p>
      <div className="contacts-pagination__nav">
        <button type="button" className="contacts-btn contacts-btn--ghost-sm" disabled={page <= 1} onClick={onPrev}>
          Avvalgi
        </button>
        <button
          type="button"
          className="contacts-btn contacts-btn--ghost-sm"
          disabled={page >= pageCount}
          onClick={onNext}
        >
          Keyingi
        </button>
      </div>
    </div>
  );
}
