const Loader = ({ color = "#000" }: { color?: string }) => {
  return (
    <div role="status" className={`text-[${color}]`}>Loader</div>
  )
}

export default Loader