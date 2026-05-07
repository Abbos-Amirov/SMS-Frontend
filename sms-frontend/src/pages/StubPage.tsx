type StubPageProps = {
  title: string;
  description?: string;
};

export default function StubPage({ title, description = 'Bu bo‘lim tez orada ulashiladi.' }: StubPageProps) {
  return (
    <div className="page">
      <h2 className="page__heading">{title}</h2>
      <p className="page__lede">{description}</p>
    </div>
  );
}
