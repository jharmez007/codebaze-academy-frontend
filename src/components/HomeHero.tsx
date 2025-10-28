
const HomeHero = () => {
  return (
    <section className="w-full bg-[#00bf63] py-16 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Stay Up To Date
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-white/90 text-base md:text-lg">
          Join our newsletter for up-to-date information on everything{" "}
          <span className="font-semibold text-white">CodeBaze Academy</span>, 
          plus free tips and tutorials.
        </p>

        {/* Form */}
        <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full sm:w-1/3 px-4 py-3 rounded-lg border bg-white text-black  border-transparent shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full sm:w-1/3 px-4 py-3 rounded-lg border bg-white text-black border-transparent shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="bg-black text-white font-bold md:ml-8 px-8 py-4 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Join Now
          </button>
        </form>

        {/* Disclaimer */}
        <p className="mt-6 text-white/80">
          You're signing up to receive emails from{" "}
          <span className="font-bold text-white">CodeBaze Academy</span>
        </p>
      </div>
    </section>
  )
}

export default HomeHero
