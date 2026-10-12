
export default function EstadoPedido({ estado }) {
  const clase = estado.toLowerCase().replace(' ', '-')
  return <span className={`estado estado--${clase}`}>{estado}</span>
}
