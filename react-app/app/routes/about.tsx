import type { MetaFunction } from 'react-router'
import { Link } from 'react-router-dom'
import { Music, Users, Calendar, Award, Target, Heart } from 'lucide-react'
import PageHeader from '../../src/components/PageHeader'

export const meta: MetaFunction = () => [
  { title: 'About Us | SoundGang' },
  {
    name: 'description',
    content: "SoundGang is Nigeria's premier record label, dedicated to discovering and amplifying the brightest talents in contemporary African music."
  }
]

export default function AboutPage() {
  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Artist Management',
      description: 'Comprehensive career development and strategic guidance for our talented roster'
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: 'Record Label',
      description: 'Professional recording, production, and distribution services'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Booking Agency',
      description: 'Connecting artists with venues and opportunities worldwide'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Concert Production',
      description: 'World-class event planning and execution for unforgettable experiences'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Promotion & Publicity',
      description: 'Strategic marketing campaigns to amplify your voice'
    }
  ]

  const stats = [
    { number: '2001', label: 'Founded' },
    { number: '15+', label: 'Artists' },
    { number: '50M+', label: 'Streams' },
    { number: '100+', label: 'Releases' }
  ]

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Passion for Music',
      description: 'We live and breathe music. Every note, every beat, every lyric matters to us.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Artist First',
      description: 'Our artists are at the heart of everything we do. Their success is our success.'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Innovation',
      description: 'We embrace new technologies and approaches to stay ahead in the industry.'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Excellence',
      description: 'We maintain the highest standards in everything from production to promotion.'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="About Us"
        subtitle="Crafting the future of African music"
        backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
      />

      <section className="bg-black py-20 text-white lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">Our Story</h2>
            <div className="mx-auto mb-8 h-1 w-20 bg-[#8B9D7F]"></div>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-gray-300">
            <p>
              SoundGang is a music company founded in 2001 and based in Lagos, Nigeria. We are an artist
              management company, a record label, a booking agency, a concert producer and a promotion
              and publicity agency.
            </p>
            <p>
              A talent-studded and fast-rising music and entertainment company, widely dubbed as the future
              of the music and entertainment industry.
            </p>
            <p className="text-xl italic text-[#8B9D7F]">
              "It is so cool to pick up the guitar and create something that did not exist 5 minutes ago. You
              can write something that no one has ever heard before. It is music at your fingertips."
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-4xl font-bold text-[#8B9D7F] lg:text-5xl">{stat.number}</div>
                <div className="text-sm text-gray-400 lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">What We Do</h2>
            <div className="mx-auto mb-6 h-1 w-20 bg-[#8B9D7F]"></div>
            <p className="mx-auto max-w-3xl text-xl text-gray-400">
              We provide comprehensive music industry services to help artists reach their full potential
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-800 bg-[#1a1a1a] p-8 transition-all duration-300 hover:border-[#8B9D7F]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#8B9D7F]/10 transition-colors group-hover:bg-[#8B9D7F]/20">
                  <div className="text-[#8B9D7F]">{service.icon}</div>
                </div>
                <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-[#8B9D7F]">{service.title}</h3>
                <p className="leading-relaxed text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-20 text-white lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">Our Values</h2>
            <div className="mx-auto mb-6 h-1 w-20 bg-[#8B9D7F]"></div>
            <p className="mx-auto max-w-3xl text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B9D7F] text-white">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white lg:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold lg:text-5xl">Ready to Join the Movement?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400">
            Whether you are an artist looking for representation or a fan wanting to stay connected, we would
            love to hear from you.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/submit"
              className="rounded-lg bg-[#8B9D7F] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#7a8c6f]"
            >
              SUBMIT YOUR MUSIC
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
