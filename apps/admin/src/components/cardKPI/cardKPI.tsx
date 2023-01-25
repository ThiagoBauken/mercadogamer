interface IProps {
  text: string | number;
  description: string;
}

export const CardKPI: React.FC<IProps> = ({ text, description }) => {
  return (
    <div className='card-kpi'>
      <h2>{text}</h2>
      <p>{description}</p>
    </div>
  )
}