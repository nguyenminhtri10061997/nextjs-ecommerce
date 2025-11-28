
export default async function HomeCategorySection() {

  return (
    <div className="bg-[#F0F0F0] rounded-4xl p-[4rem]">
      <div className="mt-[0.4375rem] italic text-5xl text-center">BROWSE BY dress STYLE</div>
      <div className="grid grid-cols-5 gap-5 mt-16 auto-rows-[18.0625rem]">
        <div className="col-span-2 bg-[url(/images/casual.png)] pt-7 pl-9 italic text-4xl rounded-3xl bg-position-[80_-130px]">Casual</div>
        <div className="col-span-3 bg-[url(/images/formal.png)] pt-7 pl-9 italic text-4xl rounded-3xl bg-left">Formal</div>
        <div className="col-span-3 bg-[url(/images/party.png)] pt-7 pl-9 italic text-4xl rounded-3xl bg-left">Party</div>
        <div className="col-span-2 bg-[url(/images/gym.png)] pt-7 pl-9 italic text-4xl rounded-3xl bg-left">Gym</div>
      </div>
    </div>
  )
}
