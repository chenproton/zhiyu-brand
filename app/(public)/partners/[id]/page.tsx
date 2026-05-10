import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Building2, Factory, Users2, MapPin, Landmark, Phone, Mail, Globe, Calendar, FileText, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { partners, projects, agreements } from "@/lib/mock-data"
import { PARTNER_TYPE_LABELS, PROJECT_PHASE_LABELS } from "@/lib/types"
import type { PartnerType } from "@/lib/types"

const typeIcons: Record<PartnerType, React.ReactNode> = {
  school: <Building2 className="h-5 w-5" />,
  enterprise: <Factory className="h-5 w-5" />,
  association: <Users2 className="h-5 w-5" />,
  park: <MapPin className="h-5 w-5" />,
  government: <Landmark className="h-5 w-5" />,
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = partners.find(p => p.id === id)

  if (!partner) {
    notFound()
  }

  // Get related data
  const relatedProjects = projects.filter(p => 
    p.participantIds?.includes(partner.id)
  )
  const relatedAgreements = agreements.filter(a => 
    a.partyIds?.includes(partner.id)
  )

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/partners">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回主体列表
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 rounded-xl bg-muted">
                {typeIcons[partner.type]}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-1">{partner.name}</h1>
                {partner.shortName && (
                  <p className="text-muted-foreground">{partner.shortName}</p>
                )}
              </div>
            </div>
            <Badge variant="outline" className="mb-4">
              {PARTNER_TYPE_LABELS[partner.type]}
            </Badge>
            {partner.tags && partner.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {partner.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            <p className="text-muted-foreground">{partner.description}</p>
          </div>

          {/* Contact Card */}
          <Card className="lg:w-80 shrink-0">
            <CardHeader>
              <CardTitle className="text-base">联系信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {partner.contact?.name && (
                <div className="flex items-center gap-3 text-sm">
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.contact.name}</span>
                  {partner.contact.position && (
                    <span className="text-muted-foreground">({partner.contact.position})</span>
                  )}
                </div>
              )}
              {partner.contact?.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.contact.phone}</span>
                </div>
              )}
              {partner.contact?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.contact.email}</span>
                </div>
              )}
              {partner.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    官方网站
                  </a>
                </div>
              )}
              {partner.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.address}</span>
                </div>
              )}
              {partner.joinDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>入驻时间: {partner.joinDate}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="mt-8">
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              参与项目
              <Badge variant="secondary">{relatedProjects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="agreements" className="gap-2">
              <FileText className="h-4 w-4" />
              相关协议
              <Badge variant="secondary">{relatedAgreements.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            {relatedProjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                暂无参与的项目
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-2">{project.name}</CardTitle>
                          <Badge variant="secondary" className="shrink-0">
                            {PROJECT_PHASE_LABELS[project.phase]}
                          </Badge>
                        </div>
                        <CardDescription>{project.type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="agreements" className="mt-6">
            {relatedAgreements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                暂无相关协议
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedAgreements.map((agreement) => (
                  <Card key={agreement.id}>
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">{agreement.title}</CardTitle>
                      <CardDescription>
                        有效期: {agreement.startDate} - {agreement.endDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{agreement.type}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
