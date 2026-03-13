"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit2, Trash2, Users, DollarSign, Search, CalendarDays, TrendingUp, MapPin, Clock, Heart, MessageCircle, Pin, Globe, Lock, Bell, Moon, User, Shield } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCard } from "@/components/stats-card"
import { ActivityFeed } from "@/components/activity-feed"
import { DashboardCharts } from "@/components/dashboard-charts"
import { MemberForm } from "@/components/member-form"
import { EventForm } from "@/components/event-form"
import { AnnouncementForm } from "@/components/announcement-form"
import { CotisationForm } from "@/components/cotisation-form"
import { ConfirmModal } from "@/components/confirm-modal"
import { Toast, type ToastType } from "@/components/toast"
import { cn } from "@/lib/utils"

// Types
interface Member { id: string; nom: string; prenom: string; age: number; ville: string; telephone: string; email: string; dateAdhesion: string; dureeMembership: string; statut: "actif" | "inactif"; photo: string }
interface Cotisation { id: string; membreId: string; membreNom: string; montant: number; datePaiement: string; statut: "payée" | "en attente" | "en retard"; methode: string; annee: string }
interface Event { id: string; titre: string; date: string; heure: string; lieu: string; description: string; capacite: number; participants: string[] }
interface GalleryItem { id: string; titre: string; url: string; eventId: string; likes: number; liked: boolean }
interface Announcement { id: string; titre: string; contenu: string; date: string; visibilite: "public" | "membres"; epingle: boolean; auteur: string }

// Sample data
const sampleMembers: Member[] = [
  { id: "1", nom: "El Mansouri", prenom: "Zakaria", age: 22, ville: "Sidi Bennour", telephone: "0662450781", email: "zak.mansouri@est.ma", dateAdhesion: "2025-01-05", dureeMembership: "1 an", statut: "actif", photo: "" },
  { id: "2", nom: "Chami", prenom: "Imane", age: 21, ville: "El Jadida", telephone: "0678901334", email: "imane.chami@est.ma", dateAdhesion: "2025-01-07", dureeMembership: "1 an", statut: "actif", photo: "" },
  { id: "3", nom: "Berrada", prenom: "Hamza", age: 23, ville: "Casablanca", telephone: "0650889102", email: "hamza.berrada@est.ma", dateAdhesion: "2024-12-20", dureeMembership: "6 mois", statut: "inactif", photo: "" },
  { id: "4", nom: "Ouazzani", prenom: "Sara", age: 20, ville: "Sidi Bennour", telephone: "0661234567", email: "sara.ouazzani@est.ma", dateAdhesion: "2025-02-01", dureeMembership: "1 an", statut: "actif", photo: "" },
  { id: "5", nom: "Bennani", prenom: "Youssef", age: 24, ville: "Marrakech", telephone: "0699887766", email: "youssef.bennani@est.ma", dateAdhesion: "2024-11-15", dureeMembership: "2 ans", statut: "actif", photo: "" },
]
const sampleCotisations: Cotisation[] = [
  { id: "1", membreId: "1", membreNom: "Zakaria El Mansouri", montant: 300, datePaiement: "2025-01-05", statut: "payée", methode: "Espèces", annee: "2025" },
  { id: "2", membreId: "2", membreNom: "Imane Chami", montant: 300, datePaiement: "2025-01-07", statut: "payée", methode: "Virement", annee: "2025" },
  { id: "3", membreId: "3", membreNom: "Hamza Berrada", montant: 300, datePaiement: "", statut: "en retard", methode: "", annee: "2025" },
  { id: "4", membreId: "4", membreNom: "Sara Ouazzani", montant: 300, datePaiement: "2025-02-01", statut: "payée", methode: "Carte", annee: "2025" },
  { id: "5", membreId: "5", membreNom: "Youssef Bennani", montant: 300, datePaiement: "", statut: "en attente", methode: "", annee: "2025" },
]
const sampleEvents: Event[] = [
  { id: "1", titre: "Réunion Générale des Membres", date: "2025-03-20", heure: "14:00", lieu: "Campus EST - Amphi A", description: "Réunion mensuelle pour discuter des activités du club et planifier les événements à venir.", capacite: 50, participants: ["1","2","4"] },
  { id: "2", titre: "Tournoi Sportif Inter-Clubs", date: "2025-04-05", heure: "09:00", lieu: "Stade Municipal Sidi Bennour", description: "Tournoi sportif annuel entre les clubs de l'EST.", capacite: 100, participants: ["1","3","5"] },
  { id: "3", titre: "Workshop Leadership", date: "2025-04-15", heure: "10:00", lieu: "Salle de Conférence EST", description: "Atelier de développement personnel et leadership pour les membres.", capacite: 30, participants: ["2","4"] },
]
const sampleGallery: GalleryItem[] = [
  { id: "1", titre: "Réunion d'ouverture 2025", url: "", eventId: "1", likes: 24, liked: false },
  { id: "2", titre: "Tournoi sportif", url: "", eventId: "2", likes: 45, liked: true },
  { id: "3", titre: "Workshop Leadership", url: "", eventId: "3", likes: 18, liked: false },
  { id: "4", titre: "Sortie Club", url: "", eventId: "1", likes: 32, liked: false },
  { id: "5", titre: "Cérémonie de remise", url: "", eventId: "2", likes: 56, liked: true },
  { id: "6", titre: "Journée d'intégration", url: "", eventId: "3", likes: 41, liked: false },
]
const sampleAnnouncements: Announcement[] = [
  { id: "1", titre: "Inscription ouverte — Saison 2025", contenu: "Les inscriptions pour la nouvelle saison du Club Eagles sont maintenant ouvertes. Rejoignez-nous pour une année riche en activités, événements et découvertes. Tous les étudiants sont les bienvenus !", date: "2025-03-01", visibilite: "public", epingle: true, auteur: "Admin Eagles" },
  { id: "2", titre: "Compte-rendu réunion de Mars", contenu: "Résumé de la réunion mensuelle : planification du tournoi sportif, budget approuvé pour les événements du semestre, nouveaux partenariats en discussion.", date: "2025-03-10", visibilite: "membres", epingle: false, auteur: "Admin Eagles" },
  { id: "3", titre: "Rappel — Cotisations 2025", contenu: "Nous rappelons à tous les membres que les cotisations pour l'année 2025 doivent être réglées avant le 31 mars. Contactez le bureau pour toute question.", date: "2025-03-05", visibilite: "membres", epingle: false, auteur: "Admin Eagles" },
]

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-[#080808]">
      <div className="w-[260px] bg-[#0A0A0A] border-r border-white/[0.06] skeleton-shimmer" />
      <div className="flex-1 p-6 space-y-6">
        <div className="h-12 skeleton-shimmer rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton-shimmer rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-72 skeleton-shimmer rounded-2xl" />
          <div className="h-72 skeleton-shimmer rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [cotisations, setCotisations] = useState<Cotisation[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showCotisationForm, setShowCotisationForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({ message: "", type: "info", visible: false })
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ isOpen: false, title: "", message: "", onConfirm: () => {} })

  const showToast = useCallback((message: string, type: ToastType) => { setToast({ message, type, visible: true }) }, [])
  const save = (key: string, data: unknown) => localStorage.setItem(key, JSON.stringify(data))

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) { router.push("/login"); return }
    const s = { m: localStorage.getItem("members"), c: localStorage.getItem("cotisations"), e: localStorage.getItem("events"), g: localStorage.getItem("gallery"), a: localStorage.getItem("announcements") }
    if (s.m) { setMembers(JSON.parse(s.m)); setCotisations(JSON.parse(s.c || "[]")); setEvents(JSON.parse(s.e || "[]")); setGallery(JSON.parse(s.g || "[]")); setAnnouncements(JSON.parse(s.a || "[]")) }
    else { setMembers(sampleMembers); setCotisations(sampleCotisations); setEvents(sampleEvents); setGallery(sampleGallery); setAnnouncements(sampleAnnouncements); save("members", sampleMembers); save("cotisations", sampleCotisations); save("events", sampleEvents); save("gallery", sampleGallery); save("announcements", sampleAnnouncements) }
    setLoading(false)
  }, [router])

  // CRUD
  const handleSubmitMember = (m: Member) => { const u = selectedMember ? members.map(x => x.id === m.id ? m : x) : [...members, m]; setMembers(u); save("members", u); showToast(selectedMember ? "Membre mis à jour" : "Membre ajouté", "success") }
  const handleSubmitCotisation = (c: Cotisation) => { const u = selectedCotisation ? cotisations.map(x => x.id === c.id ? c : x) : [...cotisations, c]; setCotisations(u); save("cotisations", u); showToast(selectedCotisation ? "Cotisation mise à jour" : "Paiement enregistré", "success") }
  const handleSubmitEvent = (e: Event) => { const u = selectedEvent ? events.map(x => x.id === e.id ? e : x) : [...events, e]; setEvents(u); save("events", u); showToast(selectedEvent ? "Événement mis à jour" : "Événement créé", "success") }
  const handleSubmitAnnouncement = (a: Announcement) => { const u = selectedAnnouncement ? announcements.map(x => x.id === a.id ? a : x) : [...announcements, a]; setAnnouncements(u); save("announcements", u); showToast(selectedAnnouncement ? "Annonce mise à jour" : "Annonce publiée", "success") }

  const deleteMember = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer ce membre ?", onConfirm: () => { const u = members.filter(x => x.id !== id); setMembers(u); save("members", u); showToast("Membre supprimé", "success"); setConfirmModal(p => ({ ...p, isOpen: false })) } })
  const deleteCotisation = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cette cotisation ?", onConfirm: () => { const u = cotisations.filter(x => x.id !== id); setCotisations(u); save("cotisations", u); showToast("Cotisation supprimée", "success"); setConfirmModal(p => ({ ...p, isOpen: false })) } })
  const deleteEvent = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cet événement ?", onConfirm: () => { const u = events.filter(x => x.id !== id); setEvents(u); save("events", u); showToast("Événement supprimé", "success"); setConfirmModal(p => ({ ...p, isOpen: false })) } })
  const deleteAnnouncement = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cette annonce ?", onConfirm: () => { const u = announcements.filter(x => x.id !== id); setAnnouncements(u); save("announcements", u); showToast("Annonce supprimée", "success"); setConfirmModal(p => ({ ...p, isOpen: false })) } })

  const toggleLike = (id: string) => { const u = gallery.map(g => g.id === id ? { ...g, liked: !g.liked, likes: g.liked ? g.likes - 1 : g.likes + 1 } : g); setGallery(u); save("gallery", u) }

  // Stats
  const paidC = cotisations.filter(c => c.statut === "payée").length
  const totalRev = cotisations.filter(c => c.statut === "payée").reduce((s, c) => s + c.montant, 0)
  const activeM = members.filter(m => m.statut === "actif").length
  const filtered = members.filter(m => !searchQuery || `${m.prenom} ${m.nom} ${m.email} ${m.ville}`.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) return <LoadingSkeleton />

  return (
    <div className="flex h-screen bg-[#080808] text-[#F5F5F5] overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 ml-[260px] flex flex-col overflow-hidden">
        <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} sidebarCollapsed={false} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-6">

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-bold text-white">Dashboard</h2><p className="text-sm text-[#606060] mt-0.5">Vue d&apos;ensemble — Club Eagles</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard label="Total Membres" value={members.length} icon={Users} trend={12} variant="accent" />
                  <StatsCard label="Membres Actifs" value={activeM} icon={TrendingUp} trend={8} variant="success" />
                  <StatsCard label="Événements" value={events.length} icon={CalendarDays} trend={5} />
                  <StatsCard label="Revenus (DH)" value={totalRev} icon={DollarSign} trend={15} variant="warning" suffix=" DH" />
                </div>
                <DashboardCharts />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ActivityFeed />
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><DollarSign size={14} className="text-[#D45902]" />Cotisations Récentes</h3>
                    <div className="space-y-3">{cotisations.slice(0, 5).map(c => (
                      <div key={c.id} className="flex items-center justify-between"><div><p className="text-xs font-medium text-white">{c.membreNom}</p><p className="text-[10px] text-[#606060]">{c.datePaiement || "Non payé"}</p></div>
                        <div className="text-right"><p className="text-xs font-bold text-white">{c.montant} DH</p><span className={cn("text-[10px] font-semibold", c.statut === "payée" && "text-[#22C55E]", c.statut === "en attente" && "text-[#F59E0B]", c.statut === "en retard" && "text-[#EF4444]")}>{c.statut}</span></div></div>
                    ))}</div>
                  </div>
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-[#D45902]" />Performance</h3>
                    <div className="space-y-4">{[
                      { label: "Taux de paiement", value: cotisations.length > 0 ? Math.round((paidC / cotisations.length) * 100) : 0 },
                      { label: "Membres actifs", value: members.length > 0 ? Math.round((activeM / members.length) * 100) : 0 },
                      { label: "Participation", value: 78 },
                    ].map((m, i) => (<div key={i}><div className="flex justify-between mb-1"><span className="text-xs text-[#A0A0A0]">{m.label}</span><span className="text-xs font-bold text-white">{m.value}%</span></div><div className="w-full bg-white/[0.06] rounded-full h-1.5"><div className="bg-[#D45902] rounded-full h-1.5 transition-all duration-1000" style={{ width: `${m.value}%` }} /></div></div>))}</div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS */}
            {activeTab === "members" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-white">Membres</h2><p className="text-sm text-[#606060]">{members.length} membre(s) enregistré(s)</p></div>
                  <button onClick={() => { setSelectedMember(null); setShowMemberForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Ajouter</button>
                </div>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/[0.06]">
                    {["Membre", "Email", "Ville", "Âge", "Statut", "Actions"].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#606060]">{h}</th>)}
                  </tr></thead><tbody>
                    {filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center"><Search size={32} className="mx-auto text-[#606060]/30 mb-2" /><p className="text-sm text-[#606060]">Aucun membre trouvé</p></td></tr> :
                    filtered.map(m => (<tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-xs font-bold text-white">{m.prenom[0]}{m.nom[0]}</div><div><span className="text-sm font-medium text-white">{m.prenom} {m.nom}</span><p className="text-[10px] text-[#606060]">Depuis {m.dateAdhesion}</p></div></div></td>
                      <td className="px-5 py-3.5 text-sm text-[#A0A0A0]">{m.email}</td>
                      <td className="px-5 py-3.5 text-sm text-[#A0A0A0]">{m.ville}</td>
                      <td className="px-5 py-3.5 text-sm text-[#A0A0A0]">{m.age}</td>
                      <td className="px-5 py-3.5"><span className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold", m.statut === "actif" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]")}>{m.statut}</span></td>
                      <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedMember(m); setShowMemberForm(true) }} className="p-1.5 rounded-lg text-[#606060] hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteMember(m.id)} className="p-1.5 rounded-lg text-[#606060] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><Trash2 size={14} /></button>
                      </div></td>
                    </tr>))}
                  </tbody></table></div>
                </div>
              </div>
            )}

            {/* CONTRIBUTIONS */}
            {activeTab === "contributions" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-white">Cotisations</h2><p className="text-sm text-[#606060]">{paidC}/{cotisations.length} payée(s) — Total: {totalRev} DH</p></div>
                  <button onClick={() => { setSelectedCotisation(null); setShowCotisationForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Enregistrer</button>
                </div>
                {/* Progress bar */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex justify-between mb-2"><span className="text-sm text-[#A0A0A0]">Taux de collecte</span><span className="text-sm font-bold text-white">{cotisations.length > 0 ? Math.round((paidC / cotisations.length) * 100) : 0}%</span></div>
                  <div className="w-full bg-white/[0.06] rounded-full h-3"><div className="bg-gradient-to-r from-[#D45902] to-[#22C55E] rounded-full h-3 transition-all duration-1000" style={{ width: `${cotisations.length > 0 ? (paidC / cotisations.length) * 100 : 0}%` }} /></div>
                </div>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/[0.06]">
                    {["Membre", "Montant", "Date", "Méthode", "Statut", "Actions"].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#606060]">{h}</th>)}
                  </tr></thead><tbody>
                    {cotisations.map(c => (<tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{c.membreNom}</td>
                      <td className="px-5 py-3.5 text-sm text-white font-semibold">{c.montant} DH</td>
                      <td className="px-5 py-3.5 text-sm text-[#A0A0A0]">{c.datePaiement || "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-[#A0A0A0]">{c.methode || "—"}</td>
                      <td className="px-5 py-3.5"><span className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold", c.statut === "payée" && "bg-[#22C55E]/10 text-[#22C55E]", c.statut === "en attente" && "bg-[#F59E0B]/10 text-[#F59E0B]", c.statut === "en retard" && "bg-[#EF4444]/10 text-[#EF4444]")}>{c.statut}</span></td>
                      <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedCotisation(c); setShowCotisationForm(true) }} className="p-1.5 rounded-lg text-[#606060] hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteCotisation(c.id)} className="p-1.5 rounded-lg text-[#606060] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><Trash2 size={14} /></button>
                      </div></td>
                    </tr>))}
                  </tbody></table></div>
                </div>
              </div>
            )}

            {/* EVENTS */}
            {activeTab === "events" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-white">Événements</h2><p className="text-sm text-[#606060]">{events.length} événement(s) planifié(s)</p></div>
                  <button onClick={() => { setSelectedEvent(null); setShowEventForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Créer</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {events.map(ev => (
                    <div key={ev.id} className="glass-card rounded-2xl p-5 hover:border-[#D45902]/20 hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-3"><h3 className="text-sm font-bold text-white leading-tight flex-1 pr-2">{ev.titre}</h3>
                        <div className="flex gap-1"><button onClick={() => { setSelectedEvent(ev); setShowEventForm(true) }} className="p-1.5 rounded-lg text-[#606060] hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors opacity-0 group-hover:opacity-100"><Edit2 size={13} /></button><button onClick={() => deleteEvent(ev.id)} className="p-1.5 rounded-lg text-[#606060] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button></div>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0] mb-3 line-clamp-2">{ev.description}</p>
                      <div className="space-y-1.5 text-[11px] text-[#606060]">
                        <div className="flex items-center gap-1.5"><CalendarDays size={11} /><span>{ev.date}</span><Clock size={11} className="ml-2" /><span>{ev.heure}</span></div>
                        <div className="flex items-center gap-1.5"><MapPin size={11} /><span>{ev.lieu}</span></div>
                        <div className="flex items-center gap-1.5"><Users size={11} /><span>{ev.participants.length}/{ev.capacite} participants</span></div>
                      </div>
                      <div className="mt-3 w-full bg-white/[0.06] rounded-full h-1"><div className="bg-[#D45902] rounded-full h-1" style={{ width: `${(ev.participants.length / ev.capacite) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY */}
            {activeTab === "gallery" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-bold text-white">Galerie Média</h2><p className="text-sm text-[#606060]">Photos et vidéos du club</p></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-0.5 transition-all duration-200">
                      <div className="aspect-video bg-gradient-to-br from-[#D45902]/20 to-[#F97316]/10 flex items-center justify-center relative">
                        <span className="text-4xl">📸</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-white mb-2">{item.titre}</h4>
                        <div className="flex items-center gap-4">
                          <button onClick={() => toggleLike(item.id)} className={cn("flex items-center gap-1 text-xs transition-colors", item.liked ? "text-[#EF4444]" : "text-[#606060] hover:text-[#EF4444]")}><Heart size={14} fill={item.liked ? "#EF4444" : "none"} />{item.likes}</button>
                          <button className="flex items-center gap-1 text-xs text-[#606060] hover:text-white transition-colors"><MessageCircle size={14} />0</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-white">Annonces</h2><p className="text-sm text-[#606060]">Actualités et communications du club</p></div>
                  <button onClick={() => { setSelectedAnnouncement(null); setShowAnnouncementForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Publier</button>
                </div>
                <div className="space-y-4">
                  {[...announcements].sort((a, b) => (b.epingle ? 1 : 0) - (a.epingle ? 1 : 0)).map(ann => (
                    <div key={ann.id} className={cn("glass-card rounded-2xl p-6 hover:border-[#D45902]/20 transition-all group", ann.epingle && "border-[#D45902]/20 glow-orange")}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {ann.epingle && <Pin size={14} className="text-[#D45902]" />}
                          <h3 className="text-base font-bold text-white">{ann.titre}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1", ann.visibilite === "public" ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-[#F59E0B]/10 text-[#F59E0B]")}>{ann.visibilite === "public" ? <><Globe size={10} />Public</> : <><Lock size={10} />Membres</>}</span>
                          <button onClick={() => { setSelectedAnnouncement(ann); setShowAnnouncementForm(true) }} className="p-1.5 rounded-lg text-[#606060] hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors opacity-0 group-hover:opacity-100"><Edit2 size={13} /></button>
                          <button onClick={() => deleteAnnouncement(ann.id)} className="p-1.5 rounded-lg text-[#606060] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-[#A0A0A0] leading-relaxed mb-3">{ann.contenu}</p>
                      <div className="flex items-center gap-3 text-[11px] text-[#606060]"><span>{ann.date}</span><span>•</span><span>{ann.auteur}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
                <div><h2 className="text-xl font-bold text-white">Paramètres</h2><p className="text-sm text-[#606060]">Configuration de la plateforme</p></div>
                <div className="glass-card rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-2xl font-bold text-white">A</div><div><h3 className="text-base font-bold text-white">Admin Eagles</h3><p className="text-sm text-[#606060]">admin@eagles.com</p><p className="text-xs text-[#606060] mt-1">Administrateur principal</p></div></div>
                  <div className="border-t border-white/[0.06] pt-6 space-y-4">
                    {[
                      { icon: User, label: "Profil utilisateur", desc: "Gérer vos informations personnelles" },
                      { icon: Bell, label: "Notifications", desc: "Configurer les alertes et rappels" },
                      { icon: Shield, label: "Sécurité", desc: "Mot de passe et authentification" },
                      { icon: Moon, label: "Apparence", desc: "Thème sombre activé" },
                    ].map((item, i) => (<div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group"><div className="p-2.5 rounded-xl bg-white/[0.04] text-[#D45902]"><item.icon size={18} /></div><div className="flex-1"><p className="text-sm font-medium text-white">{item.label}</p><p className="text-xs text-[#606060]">{item.desc}</p></div><ChevronRight size={16} className="text-[#606060] group-hover:text-white transition-colors" /></div>))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <footer className="border-t border-white/[0.06] py-4 mt-8">
            <p className="text-center text-[11px] text-[#606060]">© Ahmed Arryan Bennifou — Club Eagles Management System</p>
          </footer>
        </main>
      </div>

      {/* Modals */}
      {showMemberForm && <MemberForm member={selectedMember} onSubmit={handleSubmitMember} onClose={() => setShowMemberForm(false)} />}
      {showCotisationForm && <CotisationForm cotisation={selectedCotisation} membres={members} onSubmit={handleSubmitCotisation} onClose={() => setShowCotisationForm(false)} />}
      {showEventForm && <EventForm event={selectedEvent} onSubmit={handleSubmitEvent} onClose={() => setShowEventForm(false)} />}
      {showAnnouncementForm && <AnnouncementForm announcement={selectedAnnouncement} onSubmit={handleSubmitAnnouncement} onClose={() => setShowAnnouncementForm(false)} />}
      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(p => ({ ...p, isOpen: false }))} />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(p => ({ ...p, visible: false }))} />
    </div>
  )
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
}
