﻿using Application.Workspaces;
using Domain;

namespace Application.Common;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        CreateMap<Workspace, WorkspaceDto>();
    }
}
