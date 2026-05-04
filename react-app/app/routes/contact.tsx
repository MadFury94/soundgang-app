import { useState } from 'react'
import type { MetaFunction } from 'react-router'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import PageHeader from '../../src/components/PageHeader'

export const meta: MetaFunction = () => [
  { title: 'Contact | SoundGang' },
  {
    name: 'description',
    content: 'Get in touch with the SoundGang team.'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with the SoundGang team"
        backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
      />

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">Let's Connect</h2>
              <p className="mb-12 text-lg text-gray-400">
                Whether you are an artist looking to work with us, a fan with questions, or a partner
                interested in collaboration, we would love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-[#8B9D7F]">
                  <div className="rounded-full bg-[#8B9D7F]/10 p-3">
                    <Mail className="h-6 w-6 text-[#8B9D7F]" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Email</h3>
                    <a href="mailto:info@soundgang.com" className="text-gray-400 transition-colors hover:text-[#8B9D7F]">
                      info@soundgang.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-[#8B9D7F]">
                  <div className="rounded-full bg-[#8B9D7F]/10 p-3">
                    <Phone className="h-6 w-6 text-[#8B9D7F]" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Phone</h3>
                    <a href="tel:+2341234567890" className="text-gray-400 transition-colors hover:text-[#8B9D7F]">
                      +234 123 456 7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-[#8B9D7F]">
                  <div className="rounded-full bg-[#8B9D7F]/10 p-3">
                    <MapPin className="h-6 w-6 text-[#8B9D7F]" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Location</h3>
                    <p className="text-gray-400">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 lg:p-10">
              <h2 className="mb-6 text-2xl font-bold text-white lg:text-3xl">Send Us a Message</h2>

              {submitStatus === 'success' && (
                <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                  <p className="text-sm text-green-400">
                    Thank you for your message. We will get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block font-medium text-white">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-[#8B9D7F] focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block font-medium text-white">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-[#8B9D7F] focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block font-medium text-white">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white transition-colors focus:border-[#8B9D7F] focus:outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="artist">Artist Collaboration</option>
                    <option value="booking">Studio Booking</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block font-medium text-white">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-lg border border-gray-800 bg-black px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-[#8B9D7F] focus:outline-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8B9D7F] py-4 font-semibold text-white transition-colors hover:bg-[#7a8c6f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">o</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
